import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import "../Style/TransactionForm.css";

type TransactionFormProps = {
  title: string;
  type: "purchase" | "sales";
  bgColor?: string;
  titileColor?: string;
};

interface Item {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface FormValues {
  vendor: string;
  date: string;
  reference?: string;
  items: Item[];
}

const baseItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(1, "Unit price is required"),
});

const salesItemSchema = baseItemSchema.refine((data) => data.quantity <= 100, {
  message: "Quantity cannot be more than 100",
  path: ["quantity"],
});

const createFormSchema = (type: "purchase" | "sales") =>
  z.object({
    vendor: z.string().min(1, "This field is required"),
    date: z.string().min(1, "Date is required"),
    reference: z.string().optional(),
    items: z
      .array(type === "sales" ? salesItemSchema : baseItemSchema)
      .min(1, "At least one item is required"),
  });

const TransactionForm: React.FC<TransactionFormProps> = ({
  title,
  type,
  bgColor,
  titileColor,
}) => {
  const formSchema = createFormSchema(type);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor: "",
      date: "",
      reference: "",
      items: [{ name: "Item 1", quantity: 2, unitPrice: 50 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const lineTotal = (item: Item) => item.quantity * item.unitPrice;

  const grandTotal =
    items?.reduce((sum, item) => sum + lineTotal(item), 0) ?? 0;

  const onSubmit = (data: FormValues) => {
    const payload = {
      title,
      type,
      ...data,
      total: grandTotal,
    };

    console.log("Submitted Data:", payload);
    toast.success("Form submitted successfully 🎉");
  };

  const onError = () => {
    toast.error(" validation errors");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Toaster position="top-right" />

      <div className="container-fluid">
        <h2 className="titile" style={{ color: titileColor }}>
          {title}
        </h2>

        <div
          className="form-layout pt-2 px-3"
          style={{ backgroundColor: bgColor }}
        >
          {/* Top Form */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label">
                {type === "purchase" ? "Vendor" : "Customer"}
                <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className={`form-control ${errors.vendor ? "is-invalid" : ""}`}
                placeholder={
                  type === "purchase"
                    ? "Enter vendor name"
                    : "Enter customer name"
                }
                {...register("vendor")}
              />

              <div className="invalid-feedback">{errors.vendor?.message}</div>
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Date <span className="text-danger">*</span>
              </label>

              <input
                type="date"
                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                {...register("date")}
              />

              <div className="invalid-feedback">{errors.date?.message}</div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Reference No.</label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g., INV-001"
                {...register("reference")}
              />
            </div>
          </div>

          {/* Line Items */}

          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <h5 className="line-item-titile fw-semibold mb-0">Line Items</h5>

            <button
              className="btn btn-success btn-sm"
              type="button"
              onClick={() => append({ name: "", quantity: 1, unitPrice: 0 })}
            >
              + Add Item
            </button>
          </div>

          {/* Table */}

          <div className="table-responsive px-2">
            <table className="table align-middle">
              <thead
                className="table-light"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    {/* Name */}
                    <td>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.items?.[index]?.name ? "is-invalid" : ""
                        }`}
                        {...register(`items.${index}.name`)}
                      />
                      <div className="invalid-feedback">
                        {errors.items?.[index]?.name?.message}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td>
                      <input
                        type="number"
                        min={1}
                        className={`form-control ${
                          errors.items?.[index]?.quantity ? "is-invalid" : ""
                        }`}
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                      />
                      <div className="invalid-feedback">
                        {errors.items?.[index]?.quantity?.message}
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td>
                      <input
                        type="number"
                        min={0}
                        className={`form-control ${
                          errors.items?.[index]?.unitPrice ? "is-invalid" : ""
                        }`}
                        {...register(`items.${index}.unitPrice`, {
                          valueAsNumber: true,
                        })}
                      />
                      <div className="invalid-feedback">
                        {errors.items?.[index]?.unitPrice?.message}
                      </div>
                    </td>

                    {/* Line Total */}
                    <td className="fw-semibold text-primary">
                      ${lineTotal(items[index]).toFixed(2)}
                    </td>

                    {/* Action */}
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}

          <div className="card mt-2 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span className="fw-bold text-primary">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <span className="fw-bold">Grand Total</span>
                <span className="fw-bold text-primary">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}

          <div className="text-end mt-3 submit-container">
            <button type="submit" className="btn btn-primary submit-btn">
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TransactionForm;
