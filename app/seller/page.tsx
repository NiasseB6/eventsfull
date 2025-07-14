import SellerDashboard from "@/components/SellerDashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function SellerPage() {
  const { userId } = await auth();

  // Vérifie si l'utilisateur est connecté, sinon redirige vers la page d'accueil
  if (!userId) redirect("/")


  return (
    <div className="min-h-screen bg-gray-50">
      <SellerDashboard/>
    </div>
  )
}

export default SellerPage;
