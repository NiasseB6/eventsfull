"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Vous rechercher quelque chose ?"
          className="w-full py-3 px-4 pl-12 bg-white rounded-xl border
        border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
        duration-200"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2
        text-gray-500 w-5 h-5"/>
        <button 
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#184C99]
        text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors
        duration-200"> Recherche</button>
     </form>
    </div>
  );
}

export default SearchBar;
