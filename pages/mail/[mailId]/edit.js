import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";
import Layout from "app/core/layouts/Layout";
import getMail from "app/mail/queries/getMail";
import updateMail from "app/mail/mutations/updateMail";
import { MailForm, FORM_ERROR } from "app/mail/components/MailForm";
export const EditMail = () => {
  const router = useRouter();
  const mailId = useParam("mailId", "number");
  const [mail, { setQueryData }] = useQuery(
    getMail,
    {
      id: mailId,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateMailMutation] = useMutation(updateMail);
  return (
    <>
      <Head>
        <title>Edit Mail {mail.id}</title>
      </Head>

      <div>
        <h1>Edit Mail {mail.id}</h1>
        <pre>{JSON.stringify(mail, null, 2)}</pre>

        <MailForm
          submitText="Update Mail" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateMail}
          initialValues={mail}
          onSubmit={async (values) => {
            try {
              const updated = await updateMailMutation({
                id: mail.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(
                Routes.ShowMailPage({
                  mailId: updated.id,
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

const EditMailPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditMail />
      </Suspense>

      <p>
        <Link href={Routes.MailPage()}>
          <a>Mail</a>
        </Link>
      </p>
    </div>
  );
};

EditMailPage.authenticate = true;

EditMailPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditMailPage;
