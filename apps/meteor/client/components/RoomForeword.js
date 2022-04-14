import { Avatar, Margins, Flex, Box, Tag } from '@rocket.chat/fuselage';
import React, { useCallback } from 'react';

import { Rooms, Users } from '../../app/models/client';
import { getUserAvatarURL } from '../../app/utils/client';
import { useTranslation } from '../contexts/TranslationContext';
import { useUser } from '../contexts/UserContext';
import { useReactiveValue } from '../hooks/useReactiveValue';
import { VoipRoomForeword } from './voip/room/VoipRoomForeword';

const RoomForeword = ({ _id, rid = _id }) => {
	const t = useTranslation();

	const user = useUser();
	const room = useReactiveValue(useCallback(() => Rooms.findOne({ _id: rid }), [rid]));

	if (room?.t === 'v') {
		return <VoipRoomForeword room={room} />;
	}

	if (room?.t !== 'd') {
		return (
			<Box fontScale='c1' color='default' display='flex' justifyContent='center'>
				{t('Start_of_conversation')}
			</Box>
		);
	}

	const usernames = room.usernames.filter((username) => username !== user.username);
	if (usernames.length < 1) {
		return null;
	}

	return (
		<Box is='div' flexGrow={1} display='flex' justifyContent='center' flexDirection='column'>
			<Flex.Item grow={1}>
				<Margins block='x24'>
					<Avatar.Stack>
						{usernames.map((username, index) => {
							const user = Users.findOne({ username }, { fields: { avatarETag: 1 } });

							const avatarUrl = getUserAvatarURL(username, user?.avatarETag);

							return <Avatar key={index} size='x48' title={username} url={avatarUrl} data-username={username} />;
						})}
					</Avatar.Stack>
				</Margins>
			</Flex.Item>
			<Box display='flex' color='default' fontScale='h2' flexGrow={1} justifyContent='center'>
				{t('Direct_message_you_have_joined')}
			</Box>
			<Box is='div' mb='x8' flexGrow={1} display='flex' justifyContent='center'>
				{usernames.map((username, index) => (
					<Margins inline='x4' key={index}>
						<Box is='a' href={`/direct/${username}`}>
							<Tag variant='secondary' className='mention-link' data-username={username} medium>
								{username}
							</Tag>
						</Box>
					</Margins>
				))}
			</Box>
		</Box>
	);
};

export default RoomForeword;
