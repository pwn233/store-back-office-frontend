import { ItemModel } from "@/models/stock/item";
import { Button, Center, Table, Text } from "@mantine/core";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { JSX } from "react";

interface ItemsTableModel {
  data: ItemModel[] | undefined;
}
const ItemsTable = ({ data }: ItemsTableModel) => {
  let rows: JSX.Element[] = [];
  if (data && data.length > 0) {
    rows = data.map((element: ItemModel) => (
      <Table.Tr key={element.id}>
        <Table.Td>
          <Center>
            <Text truncate="end">{element.id}</Text>
          </Center>
        </Table.Td>
        <Table.Td>
          <Center>
            <Text truncate="end">{element.name}</Text>
          </Center>
        </Table.Td>
        <Table.Td>
          <Center>
            <Button.Group>
              <Button variant="light" color="yellow" size="xs">
                <Center>
                  <IconSettings />
                </Center>
              </Button>
              <Button variant="light" color="red" size="xs">
                <Center>
                  <IconTrash />
                </Center>
              </Button>
            </Button.Group>
          </Center>
        </Table.Td>
      </Table.Tr>
    ));
  }

  return (
    <Table withTableBorder layout="fixed" w="100%">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            <Center>
              <Text>ID</Text>
            </Center>
          </Table.Th>
          <Table.Th>
            <Center>
              <Text>Name</Text>
            </Center>
          </Table.Th>
          <Table.Th>
            <Center>
              <Text>EDIT</Text>
            </Center>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
export default ItemsTable;
