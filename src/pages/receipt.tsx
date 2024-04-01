import WebApplicationShell from "@/components/common/appshell";
import { Card, Text, Image, Group, Badge, Button } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const ReceiptPage = () => {
  return (
    <WebApplicationShell>
      <Card shadow="xl" padding="lg" radius="md" withBorder>
        <Text
          size="xl"
          fw={640}
          variant="gradient"
          gradient={{ from: "teal", to: "blue", deg: 90 }}
        >
          Generate Receipt
        </Text>
      </Card>
      <Card shadow="xl" padding="lg" radius="md" withBorder mt={16}>
        <Card shadow="sm" padding="lg" radius="md" withBorder maw={240}>
          <Card.Section>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={80}
              alt="Norway"
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text lineClamp={2} fw={500}>
              Norway Fjord AdventuresNorway Fjord
            </Text>
          </Group>

          <Button color="blue" fullWidth mt="md" radius="md">
            Add
          </Button>
        </Card>
      </Card>
    </WebApplicationShell>
  );
};

export default ReceiptPage;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};
