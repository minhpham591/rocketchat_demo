import type { IRoom } from '@rocket.chat/core-typings';
import { IMessage } from '@rocket.chat/core-typings';
import { useCallback, useMemo } from 'react';

import { ChatMessage } from '../../../../../app/models/client';
// import { useSetting } from '../../../../contexts/SettingsContext';
import { useUserPreference } from '../../../../contexts/UserContext';
import { useReactiveValue } from '../../../../hooks/useReactiveValue';

const options = {
	sort: {
		ts: 1,
	},
};

export const useMessages = ({ rid }: { rid: IRoom['_id'] }): IMessage[] => {
	const showInMainThread = useUserPreference<boolean>('showMessageInMainThread', false);
	// const hideSettings = !!useSetting('Hide_System_Messages');

	// const room = Rooms.findOne(rid, { fields: { sysMes: 1 } });
	// const settingValues = Array.isArray(room.sysMes) ? room.sysMes : hideSettings || [];
	// const hideMessagesOfType = new Set(settingValues.reduce((array, value) => [...array, ...value === 'mute_unmute' ? ['user-muted', 'user-unmuted'] : [value]], []));
	const query = useMemo(
		() => ({
			rid,
			_hidden: { $ne: true },
			...(!showInMainThread && {
				$or: [{ tmid: { $exists: 0 } }, { tshow: { $eq: true } }],
			}),
		}),
		[rid, showInMainThread],
	);

	// if (hideMessagesOfType.size) {
	// 	query.t = { $nin: Array.from(hideMessagesOfType.values()) };
	// }

	return useReactiveValue<IMessage[]>(useCallback(() => ChatMessage.find(query, options).fetch(), [query]));
};
