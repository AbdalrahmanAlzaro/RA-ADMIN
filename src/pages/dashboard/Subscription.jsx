import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Checkbox,
} from "@material-tailwind/react";

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    priceWeekly: "",
    priceMonthly: "",
    priceYearly: "",
    isActive: true,
  });

  // Fetch all subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/subscriptions/get-all"
      );
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Open edit modal
  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      name: subscription.name,
      priceWeekly: subscription.priceWeekly,
      priceMonthly: subscription.priceMonthly,
      priceYearly: subscription.priceYearly,
      isActive: subscription.isActive,
    });
    setOpen(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit update
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/subscriptions/update-single-subscription/${selectedSubscription.id}`,
        formData
      );
      setOpen(false);
      fetchSubscriptions();
    } catch (error) {
      console.error("Failed to update subscription:", error);
    }
  };

  return (
    <div className="p-8">
      <Typography variant="h2" color="blue-gray" className="mb-8 text-center">
        Subscriptions
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="shadow-md">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                {subscription.name}
              </Typography>
              <Typography color="gray" className="mb-2 text-sm">
                {subscription.description}
              </Typography>
              <ul className="list-disc list-inside text-sm mb-4">
                {subscription.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 text-sm mb-4">
                <div>Weekly: ${subscription.priceWeekly}</div>
                <div>Monthly: ${subscription.priceMonthly}</div>
                <div>Yearly: ${subscription.priceYearly}</div>
              </div>
              <Typography
                variant="small"
                color={subscription.isActive ? "green" : "red"}
                className="mb-4"
              >
                {subscription.isActive ? "Active" : "Inactive"}
              </Typography>

              <Button
                size="sm"
                color="blue"
                onClick={() => handleEdit(subscription)}
              >
                Edit
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Edit Subscription</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Price Weekly"
              name="priceWeekly"
              value={formData.priceWeekly}
              onChange={handleChange}
              type="number"
            />
            <Input
              label="Price Monthly"
              name="priceMonthly"
              value={formData.priceMonthly}
              onChange={handleChange}
              type="number"
            />
            <Input
              label="Price Yearly"
              name="priceYearly"
              value={formData.priceYearly}
              onChange={handleChange}
              type="number"
            />
            <Checkbox
              label="Active"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleUpdate}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Subscription;
