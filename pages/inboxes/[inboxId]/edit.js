import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";
import Layout from "app/core/layouts/Layout";
import getInbox from "app/inboxes/queries/getInbox";
import updateInbox from "app/inboxes/mutations/updateInbox";
import { InboxForm, FORM_ERROR } from "app/inboxes/components/InboxForm";
export const EditInbox = () => {
  const router = useRouter();
  const inboxId = useParam("inboxId", "number");
  const [inbox, { setQueryData }] = useQuery(
    getInbox,
    {
      id: inboxId,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateInboxMutation] = useMutation(updateInbox);
  return (
    <>
      <Head>
        <title>Edit Inbox {inbox.id}</title>
      </Head>

      <div>
        <h1>Edit Inbox {inbox.id}</h1>
        <pre>{JSON.stringify(inbox, null, 2)}</pre>

        <InboxForm
          submitText="Update Inbox" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateInbox}
          initialValues={inbox}
          onSubmit={async (values) => {
            try {
              const updated = await updateInboxMutation({
                id: inbox.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(
                Routes.ShowInboxPage({
                  inboxId: updated.id,
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

const EditInboxPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditInbox />
      </Suspense>

      <p>
        <Link href={Routes.InboxesPage()}>
          <a>Inboxes</a>
        </Link>
      </p>
    </div>
  );
};

EditInboxPage.authenticate = true;

EditInboxPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditInboxPage;
