<template>
  <aside
    class="lg:col-span-4 xl:col-span-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
  >
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <div class="relative">
        <input
          v-model="search"
          type="text"
          :placeholder="t('common.search')"
          class="w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              fill-rule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 4.2 12.03l4.26 4.26a.75.75 0 1 0 1.06-1.06l-4.26-4.26A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>

    <ul class="divide-y divide-gray-100 dark:divide-gray-800">
      <li
        v-for="chat in filteredChats as IChat[]"
        :key="chat.uuid"
        @click="selectChat(chat.uuid)"
        class="flex items-center gap-3 p-3.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
      >
        <div class="relative">
          <img
            :src="
              getOutUser(chat)?.avatarUrl ??
              'https://i.pravatar.cc/150?u=' +
                (getOutUser(chat)?.uuid || chat.uuid)
            "
            alt="avatar"
            class="w-11 h-11 rounded-full object-cover"
          />
          <span
            class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-success"
            v-if="getOutUser(chat)?.isOnline"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <p class="truncate font-medium text-gray-900 dark:text-gray-100">
              {{
                getOutUser(chat)?.firstName || getOutUser(chat)?.lastName || "—"
              }}
            </p>
            <span class="text-xs text-gray-500">
              {{
                chat.messages?.length
                  ? formatChatListTime(
                      chat.messages[chat.messages.length - 1].createdAt,
                      t
                    )
                  : ""
              }}
            </span>
          </div>
          <div class="flex items-center justify-between gap-2 mt-0.5">
            <p class="truncate text-xs text-gray-800 dark:text-gray-300">
              {{
                chat.messages?.length
                  ? chat.messages[chat.messages.length - 1].content
                  : ""
              }}
            </p>
            <span
              v-if="getUnreadMessagesCount(chat) > 0"
              class="ml-2 shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-success text-black text-[13px]"
            >
              {{
                getUnreadMessagesCount(chat)
              }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>
<script setup lang="ts">
import { useChatApi } from "@/composables/api/useChatApi";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";
import type { IUser } from "@/types/user.interface";
import { useChatsStore } from "@/stores/chat/useChatsStore";

const { t } = useI18n();

const localePath = useLocalePath();
const search = ref("");

const chatsStore = useChatsStore();
const { getChats } = useChatApi();
const { user, fetchUser } = useUser();

try {
  await fetchUser();
} catch (error) {
  console.error("Failed to preload user for chat sidebar:", error);
}

const { data: chatsData } = await getChats();

// После initial fetch только заполняем Store,
// а дальше работаем только с Pinia-стором
if (chatsData.value) {
  chatsStore.setChats(chatsData.value as IChat[]);
}

function selectChat(uuid: string) {
  navigateTo(localePath(`/chats/${uuid}`));
}

const getUnreadMessagesCount = (chat: IChat): number => {
  if (!chat.messages) return 0;
  return chat.messages.filter(
    (m: IMessage) => !m.readedAt && m.sender?.uuid !== user.value?.uuid
  ).length;
};

const processedChats = computed(() => {
  if (!Array.isArray(chatsStore.chats)) return [];
  return chatsStore.chats;
});

const getOutUser = (chat: IChat): IUser | null => {
  if (!chat) return null;
  if (!user.value?.uuid) {
    return chat.user2 || chat.user1 || null;
  }

  if (chat.user1?.uuid === user.value.uuid) {
    return chat.user2 || null;
  }

  if (chat.user2?.uuid === user.value.uuid) {
    return chat.user1 || null;
  }

  return chat.user2 || chat.user1 || null;
};

const filteredChats = computed(() => {
  if (!processedChats.value.length) return [];
  const q = search.value.trim().toLowerCase();
  if (!q) return processedChats.value;

  return processedChats.value.filter((chat) => {
    const outUser = getOutUser(chat);
    const fullName = [outUser?.firstName, outUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const lastMessageContent =
      chat.messages?.[chat.messages.length - 1]?.content?.toLowerCase() || "";

    return (
      fullName.includes(q) ||
      lastMessageContent.includes(q) ||
      (chat.uuid?.toLowerCase() || "").includes(q)
    );
  });
});
</script>
