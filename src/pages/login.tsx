import {
  AppShell,
  Button,
  Card,
  Center,
  Grid,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconBrandGoogle, IconBuildingStore } from "@tabler/icons-react";
import {
  getCsrfToken,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

type Providers = Record<string, { id: string; name: string }>;
interface LoginPageProps {
  csrfToken: string;
  providers: Providers;
}
const LoginPage = ({ csrfToken, providers }: Readonly<LoginPageProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    return (
      <AppShell padding="md" header={{ height: 64 }}>
        <Head>
          <title>POC Easy Store</title>
          <meta name="description" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/buidling-store.ico" />
        </Head>
        <AppShell.Header>
          <Group h="100%" px="md">
            <IconBuildingStore size={30} color="teal" />
            <Text
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 90 }}
              fw="bold"
            >
              POS Easy Store
            </Text>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Center h="calc(100vh - 96px)">
            <Card shadow="sm" padding="lg" radius="lg" withBorder>
              <Center style={{ height: "100%" }}>
                <Grid columns={12} grow>
                  <Grid.Col span={{ lg: 12 }}>
                    <Center mt={64}>
                      <IconBuildingStore size={168} color="teal" />
                    </Center>
                    <Center mt={32}>
                      <Text
                        fz="h1"
                        variant="gradient"
                        gradient={{ from: "teal", to: "blue", deg: 90 }}
                        fw="bold"
                      >
                        POS Easy Store
                      </Text>
                    </Center>
                    <Center mt={16}>
                      <Text
                        fz="lg"
                        variant="gradient"
                        gradient={{ from: "teal", to: "blue", deg: 90 }}
                        fw="bold"
                      >
                        :store name:
                      </Text>
                    </Center>
                    <Center mt={72}>
                      <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={csrfToken}
                      />
                      {providers &&
                        Object.values(providers).map((provider) => (
                          <div key={provider.name}>
                            <Button
                              leftSection={<IconBrandGoogle />}
                              onClick={async () => {
                                signIn(provider.id);
                              }}
                              variant="outline"
                              color="teal"
                              radius={"8px"}
                            >
                              Sign in with {provider.name}
                            </Button>
                          </div>
                        ))}
                    </Center>
                  </Grid.Col>
                </Grid>
              </Center>
            </Card>
          </Center>
        </AppShell.Main>
      </AppShell>
    );
  } else {
    router.push("/dashboard");
  }
};

export default LoginPage;

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
