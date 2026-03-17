import { useState } from "react";
import { ArrowLeft, Search, Edit3, Trash2, Clock3, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

const mockListings = [
  {
    id: "1",
    title: "Chicken Wrap",
    price: 8.5,
    originalPrice: 12,
    expiresIn: "2 hrs left",
    status: "active",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Bakery Box",
    price: 6.0,
    originalPrice: 10,
    expiresIn: "1 hr left",
    status: "paused",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Pasta Meal",
    price: 9.25,
    originalPrice: 14,
    expiresIn: "Expired",
    status: "expired",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
  },
];

const filters = ["All", "Active", "Paused", "Expired"];

export function ActiveListings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredListings = mockListings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      selectedFilter === "All" ||
      item.status.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5
