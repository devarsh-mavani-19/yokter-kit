import { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Post } from "../types";
import {
  Button,
  Typography,
  useButtonStylesResolver,
  useDelete,
  useList,
  useTranslate,
  PaginationControl,
  useTable,
  Modal,
  BottomModal,
  Tooltip,
  Accordion,
} from "yokter-kit";

type Props = {
  onNavigateCreate: () => void;
  onNavigateEdit: (id: string) => void;
};

export function PostListScreen({ onNavigateCreate, onNavigateEdit }: Props) {
  const translate = useTranslate();
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomModalVisible, setBottomModalVisible] = useState(false);
  const { data, isLoading, refetch } = useList<Post>({
    resource: "posts",
    pagination: { mode: "server", current: 1, pageSize: 10 },
    sorters: [{ field: "id", order: "desc" }],
  });
  const { tableProps, current, setCurrent, pageCount } = useTable<Post>({
    resource: "posts",
    pagination: { mode: "server" },
    sorters: [{ field: "id", order: "desc" }],
  });

  const deleteMutation = useDelete({
    resource: "posts",
    successNotification: {
      type: "success",
      message: "Post deleted",
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMutation.mutate(
            { resource: "posts", id },
            {
              onSuccess: () => {
                refetch();
              },
            },
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h3">Posts</Typography>
      </View>
      <FlatList
        data={tableProps.data}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.itemContent}
              onPress={() => onNavigateEdit(String(item.id))}
            >
              <Typography variant="caption1">{item.title}</Typography>
              <Typography variant="caption2">{item.status}</Typography>
            </TouchableOpacity>
            <Button
              size="sm"
              variant="solid"
              danger
              onPress={() => handleDelete(String(item.id))}
            >
              Delete
            </Button>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <PaginationControl
        {...tableProps}
        currentPage={current}
        onPageChange={(page) => {
          setCurrent(page);
        }}
        totalPages={pageCount}
      />
      <View style={styles.demoRow}>
        <Button
          variant="outlined"
          size="sm"
          onPress={() => setModalVisible(true)}
        >
          Modal
        </Button>
        <Button
          variant="outlined"
          size="sm"
          onPress={() => setBottomModalVisible(true)}
        >
          Bottom Modal
        </Button>
        <Tooltip content="This shows post info" placement="top">
          <Typography variant="caption1" style={styles.tooltipTarget}>
            Tap me
          </Typography>
        </Tooltip>
        <Button variant="outlined" size="sm" onPress={() => onNavigateCreate()}>
          {translate("create")}
        </Button>
      </View>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Post Info"
        footer={
          <Button size="sm" onPress={() => setModalVisible(false)}>
            Close
          </Button>
        }
      >
        <Typography variant="body2">
          You have {tableProps.data?.length ?? 0} posts on this page.
        </Typography>
      </Modal>

      <Accordion
        items={[
          {
            key: "about",
            title: "About Posts",
            content: "Posts are fetched from a REST API with server-side pagination and sorting.",
          },
          {
            key: "actions",
            title: "Available Actions",
            content: "You can create, edit, and delete posts. Tap a row to edit.",
          },
          {
            key: "disabled",
            title: "Disabled Item",
            content: "This item cannot be expanded.",
            disabled: true,
          },
        ]}
      />

      <BottomModal
        visible={bottomModalVisible}
        onClose={() => setBottomModalVisible(false)}
        title="Actions"
        footer={
          <Button size="sm" onPress={() => setBottomModalVisible(false)}>
            Done
          </Button>
        }
      >
        <View style={{ gap: 8 }}>
          <Button
            variant="outlined"
            onPress={() => {
              setBottomModalVisible(false);
              onNavigateCreate();
            }}
          >
            Create Post
          </Button>
          <Button
            variant="outlined"
            onPress={() => setBottomModalVisible(false)}
          >
            Cancel
          </Button>
        </View>
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "700" },
  createBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createBtnText: { color: "#007AFF", fontWeight: "600" },
  item: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { fontSize: 16, flex: 1 },
  itemStatus: { fontSize: 12, color: "#666", marginLeft: 8 },
  deleteBtn: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#ff3b30",
  },
  deleteBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  separator: { height: 1, backgroundColor: "#eee" },
  demoRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
  },
  tooltipTarget: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
  },
});
