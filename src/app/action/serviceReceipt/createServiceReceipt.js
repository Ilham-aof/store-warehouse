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

  const outletId = formData.get("outletId")?.toString().trim();
  const customerName = formData.get("customerName")?.toString().trim();
  const customerPhone = formData.get("customerPhone")?.toString().trim();
  const device = formData.get("device")?.toString().trim();
  const serviceWarranty = formData.get("serviceWarranty")?.toString().trim();

  const errors = {};

  if (!outletId) {
    errors.outlet = "Outlet wajib dipilih";
  }

  if (!customerName) {
    errors.cusname = "Nama customer wajib diisi";
  }

  if (!customerPhone) {
    errors.cusphone = "Nomor customer wajib diisi";
  }

  if (!device) {
    errors.cusitem = "Device customer wajib diisi";
  }

  const warrantyDays = Number(serviceWarranty);

  if (!serviceWarranty || !Number.isInteger(warrantyDays) || warrantyDays < 0) {
    errors.serviceWarranty = "Garansi harus berupa jumlah hari yang valid";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

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

  // =========================================
  // 8. GENERATE NOMOR NOTA
  // =========================================

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

  console.log("=== DATA CUSTOMER ===");
  console.log("outletId :", outletId);
  console.log("Kode Nota :", invoiceNumber);
  console.log("customerName :", customerName);
  console.log("customerPhone :", customerPhone);
  console.log("device :", device);
  console.log(`garansi : ${serviceWarranty} hari`);

  console.log("=== DATA SERVICE ===");
  console.log(serviceItems);

  await prisma.serviceReceipt.create({
    data: {
      invoiceNumber,

      customerName,
      customerPhone,
      device,

      warrantyDays,
      warrantyUntil: null,

      processStatus: false,
      pickupStatus: false,

      outletId: outlet.id,

      serviceItems: {
        create: serviceItems.map((service) => ({
          description: service.description,
          price: Number(service.price),
        })),
      },
    },
  });

  revalidatePath("/receipt");

  redirect(`/receipt?outletId=${outletId}`);
}
