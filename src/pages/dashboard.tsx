import WebApplicationShell from "@/components/common/appshell";
import { Card, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <WebApplicationShell>
      {/* TODO show daily receipt create amount, daily money get from receipt, monthly receipt graph */}
      <Card shadow="xl" padding="lg" radius="md" withBorder>
        <Text>Store Dashboard</Text>
      </Card>
      <Card shadow="xl" padding="lg" radius="md" withBorder mt={16}>
        <Text>{JSON.stringify(session)}</Text>
      </Card>
    </WebApplicationShell>
  );
};

export default DashboardPage;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};
