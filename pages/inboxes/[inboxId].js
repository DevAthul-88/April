import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";
import Layout from "app/core/layouts/Layout";
import getInbox from "app/inboxes/queries/getInbox";
import deleteInbox from "app/inboxes/mutations/deleteInbox";
export const Inbox = () => {
  const router = useRouter();
  const inboxId = useParam("inboxId", "number");
  const [deleteInboxMutation] = useMutation(deleteInbox);
  const [inbox] = useQuery(getInbox, {
    id: inboxId,
  });
  return (
    <>
      <Head>
        <title>Inbox {inbox.id}</title>
      </Head>

      <div>
        <h1>Inbox {inbox.id}</h1>
        <pre>{JSON.stringify(inbox, null, 2)}</pre>

        <Link
          href={Routes.EditInboxPage({
            inboxId: inbox.id,
          })}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteInboxMutation({
                id: inbox.id,
              });
              router.push(Routes.InboxesPage());
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

const ShowInboxPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.InboxesPage()}>
          <a>Inboxes</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Inbox />
      </Suspense>
    </div>
  );
};

ShowInboxPage.authenticate = true;

ShowInboxPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowInboxPage;
