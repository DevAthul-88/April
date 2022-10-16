import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createInbox from "app/inboxes/mutations/createInbox";
import { InboxForm, FORM_ERROR } from "app/inboxes/components/InboxForm";

const NewInboxPage = () => {
  const router = useRouter();
  const [createInboxMutation] = useMutation(createInbox);
  return (
    <Layout title={"Create New Inbox"}>
      <h1>Create New Inbox</h1>

      <InboxForm
        submitText="Create Inbox" // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateInbox}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const inbox = await createInboxMutation(values);
            router.push(
              Routes.ShowInboxPage({
                inboxId: inbox.id,
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

      <p>
        <Link href={Routes.InboxesPage()}>
          <a>Inboxes</a>
        </Link>
      </p>
    </Layout>
  );
};

NewInboxPage.authenticate = true;
export default NewInboxPage;
