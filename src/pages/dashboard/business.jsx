import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function Tables() {
  const [businesses, setBusinesses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleOpenDialog = (business) => {
    setSelectedBusiness(business);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBusiness(null);
  };

  const handleStatusUpdate = async (businessId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/subscriptions/user/update-status`,
        { businessId, status: newStatus }
      );

      const updatedBusinesses = businesses.map((business) =>
        business.id === businessId
          ? { ...business, status: newStatus }
          : business
      );
      setBusinesses(updatedBusinesses);
      alert(`Business status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/subscriptions/user/get-all-businesses"
        );
        setBusinesses(response.data);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Businesses Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Business", "Email", "Phone", "Status", "Actions"].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {businesses.map((business, key) => {
                const className = `py-3 px-5 ${
                  key === businesses.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={business.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={`http://localhost:4000${business.mainImage}`}
                          alt={business.businessName}
                          size="sm"
                          variant="rounded"
                        />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {business.businessName}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {business.businessWebsiteUrl}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {business.businessEmail}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {business.businessPhone}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={
                          business.status === "approved" ? "green" : "blue-gray"
                        }
                        value={business.status}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit capitalize"
                      />
                    </td>
                    <td className={`${className} flex items-center gap-2`}>
                      <Typography
                        as="button"
                        className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                        onClick={() => handleOpenDialog(business)}
                      >
                        View
                      </Typography>

                      <Button
                        variant="filled"
                        color="green"
                        onClick={() =>
                          handleStatusUpdate(business.id, "approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="filled"
                        color="red"
                        onClick={() =>
                          handleStatusUpdate(business.id, "rejected")
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        variant="filled"
                        color="blue-gray"
                        onClick={() =>
                          handleStatusUpdate(business.id, "pending")
                        }
                      >
                        Set Pending
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Dialog */}
      {selectedBusiness && (
        <Dialog open={openDialog} handler={handleCloseDialog} size="md">
          <DialogHeader>{selectedBusiness.businessName}</DialogHeader>
          <DialogBody divider className="flex flex-col gap-4">
            <img
              src={`http://localhost:4000${selectedBusiness.mainImage}`}
              alt={selectedBusiness.businessName}
              className="h-48 w-full object-cover rounded-lg"
            />
            <Typography variant="small" color="blue-gray">
              <strong>Email:</strong> {selectedBusiness.businessEmail}
            </Typography>
            <Typography variant="small" color="blue-gray">
              <strong>Phone:</strong> {selectedBusiness.businessPhone}
            </Typography>
            <Typography variant="small" color="blue-gray">
              <strong>Website:</strong> {selectedBusiness.businessWebsiteUrl}
            </Typography>
            <Typography variant="small" color="blue-gray">
              <strong>Description:</strong>{" "}
              {selectedBusiness.businessDescription}
            </Typography>
            <Typography variant="small" color="blue-gray">
              <strong>Status:</strong> {selectedBusiness.status}
            </Typography>
            <Typography variant="small" color="blue-gray">
              <strong>Start Date:</strong>{" "}
              {new Date(selectedBusiness.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="small" color="blue-gray">
              <strong>End Date:</strong>{" "}
              {new Date(selectedBusiness.endDate).toLocaleDateString()}
            </Typography>
          </DialogBody>
          <DialogFooter>
            <Button variant="gradient" color="gray" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}

export default Tables;
