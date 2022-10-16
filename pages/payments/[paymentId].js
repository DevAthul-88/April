import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";
import Layout from "app/core/layouts/Layout";
import getPayment from "app/payments/queries/getPayment";
import deletePayment from "app/payments/mutations/deletePayment";
export const Payment = () => {
  const router = useRouter();
  const paymentId = useParam("paymentId", "number");
  const [deletePaymentMutation] = useMutation(deletePayment);
  const [payment] = useQuery(getPayment, {
    id: paymentId,
  });
  return (
    <>
      <Head>
        <title>Payment {payment.id}</title>
      </Head>

      <div>
        <h1>Payment {payment.id}</h1>
        <pre>{JSON.stringify(payment, null, 2)}</pre>

        <Link
          href={Routes.EditPaymentPage({
            paymentId: payment.id,
          })}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePaymentMutation({
                id: payment.id,
              });
              router.push(Routes.PaymentsPage());
            }
          }}
          style={{
            marginLeft: "0.5rem",
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowPaymentPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PaymentsPage()}>
          <a>Payments</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Payment />
      </Suspense>
    </div>
  );
};

ShowPaymentPage.authenticate = true;

ShowPaymentPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowPaymentPage;
