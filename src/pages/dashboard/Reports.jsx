import React, { useEffect, useState } from "react";
import { Trash, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const BASE_URL = "http://localhost:4000";

export function ReportsCards() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/reports`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();
      setReports(data.reports);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Unable to load reports. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    setDeletingIds((prev) => [...prev, reviewId]);
    try {
      const res = await fetch(`${BASE_URL}/api/review/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setReports((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== reviewId));
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getSeverityColor = (reason) => {
    const lowSeverity = ["minor issue", "outdated information", "typo"];
    const mediumSeverity = ["misinformation", "inappropriate"];
    const highSeverity = [
      "hate speech",
      "offensive content",
      "harassment",
      "threats",
    ];

    const lowerReason = reason.toLowerCase();

    if (highSeverity.some((term) => lowerReason.includes(term)))
      return "bg-red-50 border-red-300";
    if (mediumSeverity.some((term) => lowerReason.includes(term)))
      return "bg-amber-50 border-amber-300";
    return "bg-blue-50 border-blue-300";
  };

  const getSeverityIcon = (reason) => {
    const lowerReason = reason.toLowerCase();

    if (
      lowerReason.includes("hate") ||
      lowerReason.includes("threat") ||
      lowerReason.includes("harassment")
    ) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }

    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="text-gray-400">Loading reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center max-w-md">
          <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            No Reports Found
          </h3>
          <p className="text-blue-600">
            There are currently no reported reviews that require attention.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reported Reviews</h2>
        <button
          onClick={fetchReports}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Refresh Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {report.Review.image ? (
                  <img
                    src={`${BASE_URL}/${report.Review.image}`}
                    alt="Review"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-opacity-30 font-bold text-xl">
                    No Image
                  </div>
                )}
              </div>
              <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-md text-sm font-medium flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                {report.Review.rating}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                {report.Review.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {report.Review.description}
              </p>

              <div
                className={`p-3 rounded-lg mb-4 border ${getSeverityColor(
                  report.reason
                )} flex items-start gap-3`}
              >
                {getSeverityIcon(report.reason)}
                <div>
                  <p className="font-semibold text-gray-700 text-sm">
                    Reported Reason:
                  </p>
                  <p className="text-gray-700 text-sm">{report.reason}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {report.User.avatar ? (
                      <img
                        src={`${BASE_URL}/${report.User.avatar}`}
                        alt={report.User.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        {report.User.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {report.User.name}
                    </p>
                    <p className="text-xs text-gray-500">{report.User.email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(report.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => deleteReview(report.reviewId)}
                  disabled={deletingIds.includes(report.reviewId)}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-md font-medium text-sm
                    ${
                      deletingIds.includes(report.reviewId)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    } transition-colors`}
                >
                  <Trash className="w-4 h-4" />
                  {deletingIds.includes(report.reviewId)
                    ? "Deleting..."
                    : "Delete Review"}
                </button>
                <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-sm transition-colors">
                  Dismiss Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsCards;
