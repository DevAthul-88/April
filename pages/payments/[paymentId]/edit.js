import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";
import Layout from "app/core/layouts/Layout";
import getPayment from "app/payments/queries/getPayment";
import updatePayment from "app/payments/mutations/updatePayment";
import { PaymentForm, FORM_ERROR } from "app/payments/components/PaymentForm";
export const EditPayment = () => {
  const router = useRouter();
  const paymentId = useParam("paymentId", "number");
  const [payment, { setQueryData }] = useQuery(
    getPayment,
    {
      id: paymentId,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updatePaymentMutation] = useMutation(updatePayment);
  return (
    <>
      <Head>
        <title>Edit Payment {payment.id}</title>
      </Head>

      <div>
        <h1>Edit Payment {payment.id}</h1>
        <pre>{JSON.stringify(payment, null, 2)}</pre>

        <PaymentForm
          submitText="Update Payment" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdatePayment}
          initialValues={payment}
          onSubmit={async (values) => {
            try {
              const updated = await updatePaymentMutation({
                id: payment.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(
                Routes.ShowPaymentPage({
                  paymentId: updated.id,
                })
              );
            } catch (error) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditPaymentPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPayment />
      </Suspense>

      <p>
        <Link href={Routes.PaymentsPage()}>
          <a>Payments</a>
        </Link>
      </p>
    </div>
  );
};

EditPaymentPage.authenticate = true;

EditPaymentPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditPaymentPage;
