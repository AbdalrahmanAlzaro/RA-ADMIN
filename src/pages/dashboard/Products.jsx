import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Tooltip,
  Chip,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";

export default function Tables() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get("http://localhost:4000/api/products11")
      .then((response) => {
        setProducts(response.data.products || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  };

  const toggleExpandRow = (title) => {
    setExpandedRow(expandedRow === title ? null : title);
  };

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setNewStatus(product.status);
  };

  const handleCloseEdit = () => {
    setEditProduct(null);
    setNewStatus("");
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.patch(
        `http://localhost:4000/api/products/${editProduct.id}/status`,
        {
          status: newStatus,
        }
      );
      fetchProducts();
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const tableHeaders = [
    "Title",
    "Description",
    "Category",
    "SubCategory",
    "Images",
    "Status",
    "Actions",
  ];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-lg">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 p-6 flex justify-between items-center"
        >
          <Typography variant="h5" color="white">
            Products Table
          </Typography>
          <Button
            size="sm"
            color="white"
            variant="text"
            className="flex items-center gap-2"
            onClick={fetchProducts}
          >
            🔄 Refresh
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner className="h-8 w-8" color="blue" />
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <Typography color="red" className="font-medium">
                {error}
              </Typography>
              <Button color="blue" className="mt-4" onClick={fetchProducts}>
                Try Again
              </Button>
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {tableHeaders.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-xs font-bold uppercase text-blue-gray-500"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const {
                    id,
                    title,
                    description,
                    category,
                    subCategory,
                    mainImage,
                    otherImages,
                    status,
                  } = product;

                  const isLast = index === products.length - 1;
                  const isExpanded = expandedRow === title;
                  const rowClass = `p-4 ${
                    isLast ? "" : "border-b border-blue-gray-50"
                  }`;

                  const allOtherImages = otherImages?.split(",") || [];

                  return (
                    <Fragment key={id}>
                      <tr className={isExpanded ? "bg-blue-50" : ""}>
                        <td className={rowClass}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {title}
                          </Typography>
                        </td>
                        <td className={rowClass}>
                          <Typography className="text-sm font-normal text-blue-gray-500 line-clamp-2">
                            {description}
                          </Typography>
                        </td>
                        <td className={rowClass}>
                          <Chip
                            value={category}
                            size="sm"
                            variant="ghost"
                            color="blue"
                            className="text-xs font-medium"
                          />
                        </td>
                        <td className={rowClass}>
                          <Chip
                            value={subCategory}
                            size="sm"
                            variant="outlined"
                            color="blue-gray"
                            className="text-xs font-medium"
                          />
                        </td>
                        <td className={rowClass}>
                          <div className="flex items-center gap-2">
                            <img
                              src={`http://localhost:4000/${mainImage}`}
                              alt={title}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                            <div className="flex">
                              {allOtherImages.slice(0, 2).map((img, i) => (
                                <img
                                  key={i}
                                  src={`http://localhost:4000/${img}`}
                                  alt={`Other ${i}`}
                                  className="w-12 h-12 object-cover rounded-md border ml-1"
                                />
                              ))}
                              {allOtherImages.length > 2 && (
                                <div className="w-12 h-12 flex items-center justify-center bg-blue-gray-50 rounded-md border ml-1">
                                  <Typography
                                    variant="small"
                                    className="text-xs font-medium"
                                  >
                                    +{allOtherImages.length - 2}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={rowClass}>
                          <Chip
                            value={status}
                            size="sm"
                            variant="outlined"
                            color={status === "approved" ? "green" : "red"}
                            className="text-xs font-medium"
                          />
                        </td>
                        <td className={rowClass}>
                          <div className="flex items-center gap-2">
                            <Tooltip content="Edit Status">
                              <Button
                                variant="text"
                                color="blue"
                                size="sm"
                                onClick={() => handleOpenEdit(product)}
                              >
                                ✏️ Edit
                              </Button>
                            </Tooltip>
                            <Tooltip
                              content={
                                isExpanded ? "Hide Details" : "Show Details"
                              }
                            >
                              <Button
                                variant="text"
                                color="blue-gray"
                                size="sm"
                                onClick={() => toggleExpandRow(title)}
                              >
                                {isExpanded ? "⬆️ Less" : "⬇️ More"}
                              </Button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="bg-blue-50 p-4">
                            <div className="pl-4">
                              <Typography
                                variant="small"
                                className="font-bold mb-2"
                              >
                                Full Description:
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-blue-gray-700 mb-4"
                              >
                                {description}
                              </Typography>

                              <Typography
                                variant="small"
                                className="font-bold mb-2"
                              >
                                All Images:
                              </Typography>
                              <div className="flex flex-wrap gap-2">
                                <div className="relative">
                                  <img
                                    src={`http://localhost:4000/${mainImage}`}
                                    alt={title}
                                    className="w-20 h-20 object-cover rounded border-2 border-blue-500"
                                  />
                                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl">
                                    Main
                                  </span>
                                </div>
                                {allOtherImages.map((img, i) => (
                                  <img
                                    key={i}
                                    src={`http://localhost:4000/${img}`}
                                    alt={`Other ${i}`}
                                    className="w-20 h-20 object-cover rounded border"
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Dialog open={!!editProduct} handler={handleCloseEdit}>
        <DialogHeader>Edit Product Status</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Typography variant="small" className="font-medium">
              Current Status: <strong>{editProduct?.status}</strong>
            </Typography>
            <Select
              label="New Status"
              value={newStatus}
              onChange={(val) => setNewStatus(val)}
            >
              <Option value="approved">Approved</Option>
              <Option value="pending">Pending</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={handleCloseEdit}>
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleUpdateStatus}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
