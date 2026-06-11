import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/app/(protected)/(shop)/catalog/types";
import {
  addToFavourites,
  getFavouritesProducts,
  removeFromFavourites,
} from "@/app/(protected)/(shop)/favorite/action";
import { useModalAndNotify } from "@/store/modalAndNotify";

// Запрос списка избранного
export const useFavourites = () =>
  useQuery<Product[]>({
    queryKey: ["favourites"],
    queryFn: getFavouritesProducts,
    staleTime: Infinity,
  });

// Проверка — есть ли товар в избранном
export const useIsFavourite = (productId: string | number) => {
  const { data } = useFavourites();
  return data?.some((product) => product.id === productId) ?? false;
};
// openToast("success", "Товар добавлен в избранно");
// Добавление / удаление
export const useToggleFavourite = () => {
  const openToast = useModalAndNotify((state) => state.showNotification);
  const queryClient = useQueryClient();
  // openToast("success", "Товар добавлен в избранно");
  return useMutation({
    mutationFn: ({
      id,
      isFavourite,
    }: {
      id: string | number;
      isFavourite: boolean;
    }) => (isFavourite ? removeFromFavourites(id) : addToFavourites(id)),

    onMutate: async ({ id, isFavourite }) => {
      // Отменяем текущий рефетч чтобы не перезатёр наш оптимистичный апдейт
      await queryClient.cancelQueries({ queryKey: ["favourites"] });

      // Сохраняем старое состояние для отката
      const prev = queryClient.getQueryData<Product[]>(["favourites"]);

      // Сразу меняем кеш — UI перерисуется мгновенно
      queryClient.setQueryData<Product[]>(
        ["favourites"],
        (old = []) =>
          isFavourite
            ? old.filter((p) => p.id !== id) // удаляем
            : [...old, { id } as Product], // добавляем временный объект
      );
      if (isFavourite) {
        openToast("success", "Товар удалён из избранного");
      } else {
        openToast("success", "Товар добавлен в избранное");
      }
      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      // Запрос упал — откатываем к старому состоянию
      queryClient.setQueryData(["favourites"], ctx?.prev);
    },

    onSettled: () => {
      // После успешного запроса синхронизируемся с сервером
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });
};
