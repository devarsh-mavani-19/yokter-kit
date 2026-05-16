import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useList } from "../../../../src/hooks/use-list";
import { useDelete } from "../../../../src/hooks/use-delete";
import { Post } from "../types";
import { useLocalize } from "../../../../src/hooks/use-localize";

type Props = {
  onNavigateCreate: () => void;
  onNavigateEdit: (id: string) => void;
};

export function PostListScreen({ onNavigateCreate, onNavigateEdit }: Props) {
  const localize = useLocalize();
  const { data, isLoading, refetch } = useList<Post>({
    resource: "posts",
    pagination: { mode: "server", current: 1, pageSize: 10 },
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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Posts</Text>
        <TouchableOpacity style={styles.createBtn} onPress={onNavigateCreate}>
          <Text style={styles.createBtnText}>+ {localize("create")}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.itemContent}
              onPress={() => onNavigateEdit(String(item.id))}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemStatus}>{item.status}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(String(item.id))}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  createBtnText: { color: "#fff", fontWeight: "600" },
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
});
