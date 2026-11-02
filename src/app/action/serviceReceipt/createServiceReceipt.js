"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createServiceReceipt(prevState, formData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete("session");
    redirect("/login");
  }

  const outletId = formData.get("outletId")?.trim();
  const customerName = formData.get("customerName")?.trim();
  const customerPhone = formData.get("customerPhone")?.trim();
  const device = formData.get("device")?.trim();
  const deviceInclusions = formData.getAll("deviceInclusions");

  const inclusionLabels = {
    handphone: "Handphone",
    simcard: "SIM Card",
    charger: "Charger",
    battery: "Battery",
    memory: "Memory",
    softcase: "Soft Case",
  };

  const serviceWarranty = formData.get("serviceWarranty")?.trim();
  const rawDiscount = formData.get("discount");
  const discount = typeof rawDiscount === "string" ? rawDiscount.trim() : "";

  const discountAmount = Number(discount);

  const errors = {};

  if (!outletId) {
    errors.outlet = "Outlet wajib dipilih";
  }

  if (!customerName) {
    errors.cusname = "Nama customer wajib diisi";
  }

  if (!customerPhone) {
    errors.cusphone = "Nomor customer wajib diisi";
  } else if (!/^08\d{8,11}$/.test(customerPhone)) {
    errors.cusphone = "Nomor customer tidak valid";
  }

  if (!device) {
    errors.cusitem = "Device customer wajib diisi";
  }

  if (deviceInclusions.length === 0) {
    errors.deviceInclusions = "Pilih minimal satu kelengkapan HP";
  } else if (
    deviceInclusions.some(
      (item) =>
        typeof item !== "string" ||
        !Object.prototype.hasOwnProperty.call(inclusionLabels, item),
    )
  ) {
    errors.deviceInclusions = "Data kelengkapan tidak valid";
  }

  if (discount === "") {
    errors.discount = "Discount wajib diisi";
  } else if (!Number.isSafeInteger(discountAmount) || discountAmount < 0) {
    errors.discount = "Discount harus berupa angka yang valid";
  }

  const warrantyDays = Number(serviceWarranty);

  if (
    serviceWarranty === undefined ||
    serviceWarranty === null ||
    serviceWarranty === "" ||
    !Number.isInteger(warrantyDays) ||
    warrantyDays < 0
  ) {
    errors.serviceWarranty = "Garansi harus berupa jumlah hari yang valid";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const inclusionNames = deviceInclusions.map((item) => inclusionLabels[item]);

  const outlet = await prisma.outlet.findUnique({
    where: {
      id: outletId,
    },
    select: {
      id: true,
      code: true,
    },
  });

  if (!outlet) {
    return {
      success: false,
      errors: {
        outlet: "Outlet tidak ditemukan",
      },
    };
  }

  const services = [];

  for (const [key, value] of formData.entries()) {
    const descriptionMatch = key.match(
      /^phoneDamageType\[(\d+)\]\[description\]$/,
    );

    const priceMatch = key.match(/^servicePrice\[(\d+)\]\[price\]$/);

    if (descriptionMatch) {
      const index = Number(descriptionMatch[1]);

      if (!services[index]) {
        services[index] = {};
      }

      services[index].description = value?.toString().trim();
    }

    if (priceMatch) {
      const index = Number(priceMatch[1]);

      if (!services[index]) {
        services[index] = {};
      }

      services[index].price = value?.toString().trim();
    }
  }

  const serviceItems = services.filter(Boolean);

  if (serviceItems.length === 0) {
    return {
      success: false,
      errors: {
        general: "Minimal satu servis harus diisi",
      },
    };
  }

  const serviceErrors = {};

  serviceItems.forEach((service, index) => {
    const description = service.description;
    const price = Number(service.price);

    if (!description) {
      serviceErrors[index] = "Jenis kerusakan wajib diisi";
      return;
    }

    if (!service.price || !Number.isInteger(price) || price < 0) {
      serviceErrors[index] = "Biaya servis tidak valid";
    }
  });

  if (Object.keys(serviceErrors).length > 0) {
    return {
      success: false,
      errors: {
        service: serviceErrors,
      },
    };
  }

  const subtotal = serviceItems.reduce(
    (total, service) => total + Number(service.price),
    0,
  );

  if (discountAmount > subtotal) {
    return {
      success: false,
      errors: {
        discount: "Potongan harga melebihi total biaya servis",
      },
    };
  }

  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const dateString = `${year}${month}${day}`;

  const startOfDay = new Date(year, now.getMonth(), now.getDate());

  const endOfDay = new Date(year, now.getMonth(), now.getDate() + 1);

  const receiptCount = await prisma.serviceReceipt.count({
    where: {
      outletId: outlet.id,
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const sequence = String(receiptCount + 1).padStart(4, "0");

  const invoiceNumber = `SRV-${outlet.code}-${dateString}-${sequence}`;
  try {
    await prisma.serviceReceipt.create({
      data: {
        invoiceNumber,

        customerName,
        customerPhone,
        device,
        deviceInclusions: inclusionNames,

        warrantyDays,
        warrantyUntil: null,

        discount: discountAmount,

        processStatus: false,
        pickupStatus: false,

        outletId: outlet.id,
        userId: session.userId,
        serviceItems: {
          create: serviceItems.map((service) => ({
            description: service.description,
            price: Number(service.price),
          })),
        },
      },
    });
  } catch (error) {
    return {
      success: false,
      error: "Gagal membuat nota",
    };
  }

  revalidatePath("/order");
  redirect(`/order?outletId=${outletId}`);
}
