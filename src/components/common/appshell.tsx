import { NavigationBarModel } from "@/models/common/navigation_bar";
import {
  AppShell,
  Avatar,
  Badge,
  Box,
  Burger,
  Center,
  Container,
  Group,
  NavLink,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBuildingStore,
  IconBuildingWarehouse,
  IconDashboard,
  IconLogout,
  IconReceipt2,
} from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
interface ContentProps {
  children: JSX.Element | JSX.Element[];
}

const WebApplicationShell = (props: Readonly<ContentProps>) => {
  const navBarContent: NavigationBarModel[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <IconDashboard size="2rem" stroke={1.5} />,
    },
    {
      name: "Receipt",
      path: "/receipt",
      icon: <IconReceipt2 size="2rem" stroke={1.5} />,
    },
    {
      name: "Stock",
      path: "/stock",
      icon: <IconBuildingWarehouse size="2rem" stroke={1.5} />,
    },
  ];
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    setCurrentLocation(window.location.pathname);
  }, []);
  useEffect(() => {
    if (!session?.user) router.push("/login");
  }, [session]);
  if (session)
    return (
      <AppShell
        padding="md"
        header={{ height: 72 }}
        navbar={{
          width: 240,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="md"
              color="teal"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="md"
              color="teal"
            />
            <IconBuildingStore size={30} color="teal" />
            <Text
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 90 }}
              fw="bold"
            >
              POS Easy Store
            </Text>
            <Badge
              color="teal"
              radius="xl"
              h="42px"
              variant="light"
              pl={0}
              style={{ marginLeft: "auto" }}
            >
              <Center style={{ height: "100%" }}>
                <Avatar
                  alt="Avatar for badge"
                  size={40}
                  mr={8}
                  radius="xl"
                  src={session.user?.image ?? null}
                />
                {session.user?.name ? session.user?.name.split(" ")[0] : null}
              </Center>
            </Badge>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          {navBarContent.map((nav: NavigationBarModel) => (
            <Box
              key={nav.name}
              style={{ borderRadius: "8px 8px 8px 8px" }}
              bg={currentLocation === nav.path ? "teal" : undefined}
            >
              <NavLink
                key={nav.name}
                label={nav.name}
                variant="subtle"
                style={{ borderRadius: "8px 8px 8px 8px" }}
                leftSection={nav.icon}
                color="white"
                autoContrast={currentLocation !== nav.path}
                fw={600}
                active={currentLocation === nav.path}
                onClick={() => {
                  if (currentLocation !== nav.path) router.push(nav.path);
                }}
              />
            </Box>
          ))}
          <Box key={"nav-sign-out"} style={{ borderRadius: "8px 8px 8px 8px" }}>
            <NavLink
              key={"nav-sign-out"}
              onClick={async () => {
                await signOut({
                  redirect: true,
                  callbackUrl: "/login",
                });
              }}
              label={"Sign out"}
              variant="subtle"
              leftSection={<IconLogout size="2rem" stroke={1.5} />}
              style={{ borderRadius: "8px 8px 8px 8px" }}
              color="white"
              autoContrast
              fw={600}
            />
          </Box>
        </AppShell.Navbar>
        <AppShell.Main>{props.children}</AppShell.Main>
      </AppShell>
    );
  else return <Container h="100vh" fluid bg="white" />;
};

export default WebApplicationShell;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};
