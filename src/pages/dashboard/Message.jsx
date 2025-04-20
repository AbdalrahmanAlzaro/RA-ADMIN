import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

export function Tables() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/get/contact-messages");
      const data = await res.json();
      setMessages(data.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleReply = (email) => {
    setSelectedEmail(email);
    setOpen(true);
  };

  const sendReply = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/reply/contact-messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: selectedEmail, subject, text }),
        }
      );

      if (res.ok) {
        alert("Reply sent successfully!");
        setOpen(false);
        setSubject("");
        setText("");
      } else {
        alert("Failed to send reply.");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Contact Messages
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Email", "Message", "Date", "Action"].map((el) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map(
                ({ id, name, email, message, createdAt }, index) => (
                  <tr key={id}>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="font-semibold">{name}</Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-sm text-blue-gray-600">
                        {email}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-sm text-blue-gray-600 truncate max-w-[200px]">
                        {message}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-sm text-blue-gray-600">
                        {new Date(createdAt).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Button
                        size="sm"
                        variant="outlined"
                        color="blue"
                        onClick={() => handleReply(email)}
                      >
                        Reply
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Reply to {selectedEmail}</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            label="Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={sendReply}>
            Send Reply
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Tables;
