"use client";

import { createStripeConnectLoginLink } from "@/actions/createStripeConnectLoginLink";
import { getStripeConnectAccount } from "@/actions/getStripeConnectAccount";
import {
  AccountStatus,
  getStripeConnectAccountStatus,
} from "@/actions/getStripeConnectAccountStatus";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { Calendar, Cog, Plus } from "lucide-react";
import { createStripeConnectCustomer } from "@/actions/createStripeConnectCustomer";
import { createStripeConnectAccountLink } from "@/actions/getStripeConnectAccountLink";
import Link from "next/link";

function SellerDashboard() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePendig, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
    null
  );
  const router = useRouter();
  const { user } = useUser();
  const stripConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });

  useEffect(() => {
    if (stripConnectId) {
      fetchAccountStatus();
    }
  }, [stripConnectId]);

  if (stripConnectId === undefined) {
    return <Spinner />;
  }

  const isReadyToAcceptPayments =
    accountStatus?.isActive && accountStatus?.payoutsEnabled;

  const handleManageAccount = async () => {
    try {
      if (stripConnectId && accountStatus?.isActive) {
        const loginUrl = await createStripeConnectLoginLink(stripConnectId);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la creation du lien de connexion Stripe:",
        error
      );
      setError(true);
    }
  };

  const fetchAccountStatus = async () => {
    if (stripConnectId) {
      try {
        const status = await getStripeConnectAccountStatus(stripConnectId);
        setAccountStatus(status);
      } catch (error) {
        console.error("Erreur du fechage du statut du compte Stripe:", error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-[#b0490a] to-[#F37021] px-6 py-8 text-white">
          <h2 className="text-2xl font-bold"> tableau de bord du vendeur</h2>
          <p className="text-blue-100 mt-2">
            Gérer votre compte vendeur et vos paiements.
          </p>
        </div>

        {/* Section Content */}
        {isReadyToAcceptPayments && (
          <>
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Vendre des billets pour vos événements
              </h2>
              <p className="text-gray-600 mb-8">
                Vous êtes prêt à accepter des paiements pour vos événements.
                Vous pouvez maintenant créer et gérer vos billets.
              </p>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-center gap-4">
                  <Link
                    href="/seller/new-event"
                    className="flex items-center gap-2 bg-[#184C99] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Créer un nouvel événement
                  </Link>
                  <Link
                    href="/seller/events"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    Voir mes événements
                  </Link>
                </div>
              </div>
            </div>

            <hr className="my-8" />
          </>
        )}

        <div className="p-6">
          {/* Section de creation de compte vendeur */}
          {!stripConnectId && !accountCreatePending && (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">
                Commencer á accepter des paiements
              </h3>
              <p className="text-gray-600 mb-6">
                Pour accepter des paiements, vous devez créer un compte Stripe
                Connect.
              </p>
              <button
                onClick={async () => {
                  setAccountCreatePending(true);
                  setError(false);
                  try {
                    await createStripeConnectCustomer();
                    setAccountCreatePending(false);
                  } catch (error) {
                    console.error(
                      "Erreur lors de la création du compte Stripe:",
                      error
                    );
                    setError(true);
                    setAccountCreatePending(false);
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-[#b0490a] transition-colors"
              >
                Créer un compte Vendeur
              </button>
            </div>
          )}

          {/*  Section des status de compte */}
          {stripConnectId && accountStatus && (
            <div className="space-y-6">
              {/* Status de la carte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account status card */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Statut du compte
                  </h3>
                  <div className="mt-2 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        accountStatus.isActive
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {accountStatus.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>
                {/* Status du compte  */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Capacite de paiement
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.chargesEnabled
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.chargesEnabled
                          ? "Prêt à accepter des paiements"
                          : "Non prêt à accepter des paiements"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.payoutsEnabled
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.payoutsEnabled
                          ? "Prêt à recevoir des paiements"
                          : "Ne peut pas recevoir de paiements"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Requirements section */}
              {accountStatus.requiresInformation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-3">
                    Informations requises
                  </h3>
                  {accountStatus.requirements.currently_due.length > 0 && (
                    <div className="mb-3">
                      <p className="text-yellow-800 font-medium mb-2">
                        Informations actuellement requises:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.currently_due.map((req) => (
                          <li key={req}> {req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {accountStatus.requirements.eventually_due.length > 0 && (
                    <div>
                      <p className="text-yellow-800 font-mediummb-2">
                        Informations requises à l'avenir:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.eventually_due.map(
                          (req) => (
                            <li key={req}>{req.replace(/_/g, " ")}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {/* seulement montre le button si des informations sont requises */}
                  {!accountLinkCreatePendig && (
                    <button
                      onClick={async () => {
                        setAccountLinkCreatePending(true);
                        setError(false);
                        try {
                          const { url } =
                            await createStripeConnectAccountLink(
                              stripConnectId
                            );
                          router.push(url);
                        } catch (error) {
                          console.error(
                            "Erreur lors de la création du lien du compte Stripe:",
                            error
                          );
                          setError(true);
                        }
                        setAccountLinkCreatePending(false);
                      }}
                      className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Complèter les informations requises
                    </button>
                  )}
                </div>
              )}

              {/* Action button */}
              <div className="flex flex-wrap gap-3 mt-6">
                {accountStatus.isActive && (
                  <button
                    onClick={handleManageAccount}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-[#b0490a] transition-colors flex items-center"
                  >
                    <Cog className="w-5 h-5 mr-2" />
                    Tableau de bord du compte
                  </button>
                )}
                <button
                  onClick={fetchAccountStatus}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Rafraichir le statut du compte
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-lg">
                  Une erreur s'est produite lors de la création du lien du
                  compte Stripe.
                </div>
              )}
            </div>
          )}

          {/* loading state */}
          {accountCreatePending && (
            <div className="text-center py-4 text-gray-600">
              <Spinner />
              <p className="mt-2">Création du compte Stripe en cours...</p>
            </div>
          )}
          {accountLinkCreatePendig && (
            <div className="text-center py-4 text-gray-600">
              <Spinner />
              <p className="mt-2">  
                Preparation de la configuration du compte en cours...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
