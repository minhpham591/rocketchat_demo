import { IMessage } from '@rocket.chat/core-typings';
import { createContext, useContext } from 'react';

export type MessageListContextValue = {
	useShowTranslated: ({ message }: { message: IMessage }) => boolean;
	useShowStarred: ({ message }: { message: IMessage }) => boolean;
	useShowFollowing: ({ message }: { message: IMessage }) => boolean;
	useMessageDateFormatter: () => (date: Date) => string;
	useUserHasReacted: (message: IMessage) => (reaction: string) => boolean;
	useReactToMessage: (message: IMessage) => (reaction: string) => void;
	useReactionsFilter: (message: IMessage) => (reaction: string) => string[];
	useOpenEmojiPicker: (message: IMessage) => (event: React.MouseEvent) => void;
	showRoles: boolean;
	showRealName: boolean;
	showUsername: boolean;
	showReadReceipt: boolean;
	highlights?:
		| {
				highlight: string;
				regex: RegExp;
				urlRegex: RegExp;
		  }[];
};

export const MessageListContext = createContext<MessageListContextValue>({
	useShowTranslated: () => false,
	useShowStarred: () => false,
	useShowFollowing: () => false,
	useUserHasReacted: () => (): boolean => false,
	useMessageDateFormatter:
		() =>
		(date: Date): string =>
			date.toString(),
	useReactToMessage: () => (): void => undefined,
	useOpenEmojiPicker: () => (): void => undefined,
	useReactionsFilter:
		(message) =>
		(reaction: string): string[] =>
			message.reactions ? message.reactions[reaction]?.usernames || [] : [],
	showRoles: false,
	showRealName: false,
	showUsername: false,
	showReadReceipt: false,
});

export const useShowTranslated: MessageListContextValue['useShowTranslated'] = (...args) =>
	useContext(MessageListContext).useShowTranslated(...args);
export const useShowStarred: MessageListContextValue['useShowStarred'] = (...args) =>
	useContext(MessageListContext).useShowStarred(...args);
export const useShowFollowing: MessageListContextValue['useShowFollowing'] = (...args) =>
	useContext(MessageListContext).useShowFollowing(...args);
export const useMessageDateFormatter: MessageListContextValue['useMessageDateFormatter'] = (...args) =>
	useContext(MessageListContext).useMessageDateFormatter(...args);
export const useMessageListShowRoles = (): MessageListContextValue['showRoles'] => useContext(MessageListContext).showRoles;
export const useMessageListShowRealName = (): MessageListContextValue['showRealName'] => useContext(MessageListContext).showRealName;
export const useMessageListShowUsername = (): MessageListContextValue['showUsername'] => useContext(MessageListContext).showUsername;
export const useMessageListShowReadReceipt = (): MessageListContextValue['showReadReceipt'] =>
	useContext(MessageListContext).showReadReceipt;
export const useMessageListHighlights = (): MessageListContextValue['highlights'] => useContext(MessageListContext).highlights;

export const useUserHasReacted: MessageListContextValue['useUserHasReacted'] = (message: IMessage) =>
	useContext(MessageListContext).useUserHasReacted(message);
export const useReactToMessage: MessageListContextValue['useReactToMessage'] = (message: IMessage) =>
	useContext(MessageListContext).useReactToMessage(message);
export const useOpenEmojiPicker: MessageListContextValue['useOpenEmojiPicker'] = (...args) =>
	useContext(MessageListContext).useOpenEmojiPicker(...args);
export const useReactionsFilter: MessageListContextValue['useReactionsFilter'] = (message: IMessage) =>
	useContext(MessageListContext).useReactionsFilter(message);
