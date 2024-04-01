import WebApplicationShell from "@/components/common/appshell";
import ItemsTable from "@/components/stock/items_table";
import { CustomError } from "@/models/common/error/error";
import { CreateItemModel, ItemModel } from "@/models/stock/item";
import { isCustomError } from "@/utils/error";
import { fetcher } from "@/utils/swr_fetcher";
import {
  Button,
  Card,
  Center,
  Collapse,
  Container,
  Flex,
  Grid,
  Modal,
  NumberInput,
  Pagination,
  Text,
  TextInput,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconCurrencyBaht,
} from "@tabler/icons-react";
import { DateTime } from "luxon";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import useSWR from "swr";

const StockPage = () => {
  const { data: session } = useSession();
  const colorScheme = useComputedColorScheme();
  const initCreatePayload: CreateItemModel = {
    id: "",
    name: "",
    amount: 0,
    price: 0,
    created_by: session?.user?.email ?? "store-backoffice-frontend",
    created_at: null,
  };
  const [openedCreateDropdown, { toggle: toggleCreateDropdown }] =
    useDisclosure(false);
  const [openedViewDropdown, { toggle: toggleViewDropdown }] =
    useDisclosure(false);
  const [createPayload, setCreatePayload] =
    useState<CreateItemModel>(initCreatePayload);
  const [
    openedCreateModal,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/api/stock/item",
    fetcher,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.status === 404) return;
        if (key === "/api/user") return;
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 10000);
      },
    }
  );
  const [activePage, setPage] = useState<number>(1);
  const itemsPerPage = 5;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let payload: any = undefined;

  if (data && isCustomError(data)) payload = [];
  else payload = data;
  const currentPageData: ItemModel[] =
    payload && payload.length > 0 ? payload.slice(startIndex, endIndex) : [];

  const handleItemIDCreate = (id: string | null) => {
    setCreatePayload((prevState) => ({
      ...prevState,
      id: id,
    }));
  };
  const handleItemNameCreate = (name: string | null) => {
    setCreatePayload((prevState) => ({
      ...prevState,
      name: name,
    }));
  };
  const handleItemAmountCreate = (amount: string | number) => {
    const parsedAmount = Number(amount);
    if (amount === "") {
      setCreatePayload((prevState) => ({
        ...prevState,
        amount: null,
      }));
    } else {
      setCreatePayload((prevState) => ({
        ...prevState,
        amount: parsedAmount,
      }));
    }
  };
  const handleItemPriceCreate = (price: string | number) => {
    const parsedPrice = Number(price);
    if (price === "") {
      setCreatePayload((prevState) => ({
        ...prevState,
        price: null,
      }));
    } else {
      setCreatePayload((prevState) => ({
        ...prevState,
        price: parsedPrice,
      }));
    }
  };
  const confirmCreate = async () => {
    const res = await fetch(`/api/stock/item`, {
      method: "POST",
      body: JSON.stringify({ ...createPayload, created_at: DateTime.now() }),
    });
    if (res.status === 201) {
      closeCreateModal();
      toast("🎉 Complete!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: colorScheme === "dark" ? "dark" : "light",
        transition: Bounce,
      });
      setCreatePayload((prevState) => ({
        ...prevState,
        id: "",
        name: "",
        amount: 0,
      }));
    } else {
      closeCreateModal();
      const data: CustomError = await res.json();
      toast("😞 " + data.name + ", please try again", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: colorScheme === "dark" ? "dark" : "light",
        transition: Bounce,
      });
    }
  };
  useEffect(() => {
    if (openedCreateDropdown) {
      closeCreateModal();
      setCreatePayload((prevState) => ({
        ...prevState,
        id: "",
        name: "",
        amount: 0,
        price: 0,
      }));
    }
  }, [openedCreateDropdown]);
  if (error)
    return (
      <WebApplicationShell>
        <Container
          h="100vh"
          fluid
          bg={colorScheme === "dark" ? "dark" : "light"}
        >
          <Center>
            <Text>Something went wrong, please try again.</Text>
          </Center>
        </Container>
      </WebApplicationShell>
    );
  return (
    <WebApplicationShell>
      <Head>
        <title>Stock</title>
        <meta name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/building-store.ico" />
      </Head>
      <ToastContainer />
      <Modal
        radius="lg"
        opened={openedCreateModal}
        onClose={closeCreateModal}
        centered
        withCloseButton={false}
      >
        <Center
          style={{
            dispaly: "flex",
            flexDirection: "column",
          }}
          pt={32}
        >
          <Text
            size="xl"
            fw={640}
            variant="gradient"
            gradient={{ from: "teal", to: "blue", deg: 90 }}
          >
            Confirmation
          </Text>
          <Text size="md" fw={640} c="teal" mt={32}>
            This action will create item :&nbsp;
            <Text span c="blue" inherit>
              {createPayload.id}
            </Text>
          </Text>
          <Grid grow mt={32}>
            <Grid.Col span={5.5}>
              <Button
                variant="light"
                color="teal"
                fullWidth
                disabled={
                  createPayload.id === null ||
                  createPayload.id === "" ||
                  createPayload.amount === null ||
                  createPayload.price === null ||
                  createPayload.price === 0 ||
                  createPayload.name === null ||
                  createPayload.name === ""
                }
                radius="md"
                onClick={async () => await confirmCreate()}
              >
                <Text fw={600} tt="uppercase">
                  Confirm
                </Text>
              </Button>
            </Grid.Col>
            <Grid.Col span={5.5}>
              <Button
                variant="light"
                color="red"
                fullWidth
                disabled={
                  createPayload.id === null ||
                  createPayload.id === "" ||
                  createPayload.amount === null ||
                  createPayload.price === null ||
                  createPayload.price === 0 ||
                  createPayload.name === null ||
                  createPayload.name === ""
                }
                radius="md"
                onClick={() => {
                  closeCreateModal();
                }}
              >
                <Text fw={600} tt="uppercase">
                  Cancel
                </Text>
              </Button>
            </Grid.Col>
          </Grid>
        </Center>
      </Modal>
      <Card shadow="xl" padding="lg" radius="lg" withBorder>
        <Button
          radius="md"
          variant="subtle"
          justify="space-between"
          onClick={toggleCreateDropdown}
          fullWidth
          leftSection={
            <Text
              size="xl"
              fw={640}
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 90 }}
              ta="left"
            >
              Create Item
            </Text>
          }
          rightSection={
            openedCreateDropdown ? <IconChevronUp /> : <IconChevronDown />
          }
        />
        <Collapse in={openedCreateDropdown} transitionDuration={750} mt={16}>
          <TextInput
            mb={16}
            size="md"
            color="teal"
            radius="md"
            value={createPayload.id ?? undefined}
            placeholder="ID"
            onChange={(event) => handleItemIDCreate(event.currentTarget.value)}
          />
          <TextInput
            mb={16}
            size="md"
            color="teal"
            radius="md"
            value={createPayload.name ?? undefined}
            placeholder="Name"
            onChange={(event) =>
              handleItemNameCreate(event.currentTarget.value)
            }
          />
          <NumberInput
            mb={16}
            size="md"
            color="teal"
            radius="md"
            value={createPayload.amount ?? ""}
            allowNegative={false}
            allowDecimal={false}
            stepHoldDelay={500}
            min={0}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            placeholder="Amount"
            onChange={(event) => handleItemAmountCreate(event)}
          />
          <NumberInput
            mb={16}
            size="md"
            color="teal"
            radius="md"
            value={createPayload.price ?? ""}
            allowNegative={false}
            allowDecimal={true}
            min={0}
            leftSection={<IconCurrencyBaht />}
            hideControls
            placeholder="Price"
            onChange={(event) => handleItemPriceCreate(event)}
          />
          <Collapse
            in={
              createPayload.id !== null &&
              createPayload.id !== "" &&
              createPayload.amount !== null &&
              createPayload.price !== null &&
              createPayload.price !== 0 &&
              createPayload.name !== null &&
              createPayload.name !== ""
            }
            mt={16}
            transitionDuration={750}
          >
            <Button
              variant="light"
              color="teal"
              fullWidth
              disabled={
                createPayload.id === null ||
                createPayload.id === "" ||
                createPayload.amount === null ||
                createPayload.price === null ||
                createPayload.price === 0 ||
                createPayload.name === null ||
                createPayload.name === ""
              }
              radius="md"
              onClick={() => openCreateModal()}
            >
              <Text fw={600} tt="uppercase">
                Create
              </Text>
            </Button>
          </Collapse>
        </Collapse>
      </Card>
      <Card shadow="xl" padding="lg" radius="lg" withBorder mt={16}>
        <Button
          radius="md"
          variant="subtle"
          justify="space-between"
          onClick={toggleViewDropdown}
          fullWidth
          leftSection={
            <Text
              size="xl"
              fw={640}
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 90 }}
              ta="left"
            >
              View Stocks
            </Text>
          }
          rightSection={
            openedViewDropdown ? <IconChevronUp /> : <IconChevronDown />
          }
        />
        <Collapse in={openedViewDropdown} transitionDuration={750} mt={16}>
          {payload && payload.length > 0 ? (
            <Container>
              <Grid>
                <Grid.Col>
                  <ItemsTable data={currentPageData} />
                </Grid.Col>
                {Math.ceil(payload.length / itemsPerPage) > 1 ? (
                  <Grid.Col>
                    <Flex justify="flex-end">
                      <Pagination
                        withEdges
                        gap="md"
                        siblings={1}
                        total={payload.length / itemsPerPage}
                        value={activePage}
                        onChange={setPage}
                        autoContrast
                        color="teal"
                        radius="md"
                      />
                    </Flex>
                  </Grid.Col>
                ) : null}
              </Grid>
            </Container>
          ) : (
            <Center>
              <Text>There is no records at this time.</Text>
            </Center>
          )}
        </Collapse>
      </Card>
    </WebApplicationShell>
  );
};

export default StockPage;
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};
