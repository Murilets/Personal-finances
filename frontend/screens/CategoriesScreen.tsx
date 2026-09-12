import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import CategoryCard from '../components/CategoryCard';
import CategoryFormDialog, { CategoryFormValues } from '../components/CategoryFormDialog';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { ApiError } from '../services/api';
import { customColors } from '../constants/theme';
import { useSnackbar } from '../context/SnackbarContext';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../types/category';

export default function CategoriesScreen() {
  const { categories, isLoading, isError, refetch, create, update, remove } = useCategories();
  const { showSuccess, showError } = useSnackbar();
  const [formVisible, setFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const mutationError =
    (create.error as ApiError | null)?.message ??
    (update.error as ApiError | null)?.message ??
    null;

  const openCreate = () => {
    setEditingCategory(null);
    setFormVisible(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    create.reset();
    update.reset();
  };

  const handleSubmit = (values: CategoryFormValues) => {
    const request = { name: values.name, description: values.description || null };
    if (editingCategory) {
      update.mutate(
        { id: editingCategory.id, request },
        {
          onSuccess: () => {
            setFormVisible(false);
            showSuccess('Categoria atualizada com sucesso!');
          },
          onError: (error) => {
            const apiError = error as ApiError;
            showError(apiError?.message || 'Erro ao atualizar categoria');
          },
        }
      );
    } else {
      create.mutate(request, {
        onSuccess: () => {
          setFormVisible(false);
          showSuccess('Categoria criada com sucesso!');
        },
        onError: (error) => {
          const apiError = error as ApiError;
          showError(apiError?.message || 'Erro ao criar categoria');
        },
      });
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        showSuccess('Categoria excluída com sucesso!');
      },
      onError: (error) => {
        const apiError = error as ApiError;
        setDeleteTarget(null);
        showError(apiError?.message || 'Erro ao excluir categoria');
      },
    });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text variant="headlineSmall">Categorias</Text>
          <Text style={styles.subtitle}>Organize seus gastos por tipo</Text>
        </View>
        <Button mode="contained" onPress={openCreate}>
          + Nova categoria
        </Button>
      </View>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="Não foi possível carregar as categorias." onRetry={refetch} />}
      {!isLoading && !isError && categories.length === 0 && (
        <EmptyState message="Nenhuma categoria cadastrada ainda." />
      )}
      {!isLoading && !isError && categories.length > 0 && (
        <View style={styles.grid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => openEdit(category)}
              onDelete={() => setDeleteTarget(category)}
            />
          ))}
        </View>
      )}

      <CategoryFormDialog
        visible={formVisible}
        category={editingCategory}
        onDismiss={closeForm}
        onSubmit={handleSubmit}
        submitting={create.isPending || update.isPending}
        errorMessage={mutationError}
      />

      <Portal>
        <Dialog visible={!!deleteTarget} onDismiss={() => setDeleteTarget(null)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Excluir categoria</Dialog.Title>
          <Dialog.Content>
            <Text>
              Tem certeza que deseja excluir "{deleteTarget?.name}"? Essa ação não pode ser
              desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)} disabled={remove.isPending}>
              Cancelar
            </Button>
            <Button
              onPress={confirmDelete}
              loading={remove.isPending}
              disabled={remove.isPending}
              textColor={customColors.expense}
            >
              Excluir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 36 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  subtitle: { color: customColors.textSecondary, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 12,
    maxWidth: 440,
    width: '90%',
    alignSelf: 'center',
  },
  dialogTitle: {
    color: '#000000',
  },
});
