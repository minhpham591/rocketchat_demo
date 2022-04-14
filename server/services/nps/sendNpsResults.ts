import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';

import { settings } from '../../../app/settings/server';
import { getWorkspaceAccessToken } from '../../../app/cloud/server';
import { INpsVote } from '../../../definition/INps';
import { SystemLogger } from '../../lib/logger/system';

type NPSResultPayload = {
	total: number;
	votes: Pick<INpsVote, 'identifier' | 'roles' | 'score' | 'comment'>[];
};

export const sendNpsResults = Meteor.bindEnvironment(function sendNpsResults(npsId: string, data: NPSResultPayload) {
	const token: string = getWorkspaceAccessToken();
	if (!token) {
		return false;
	}

	const npsUrl = settings.get('Nps_Url');

	try {
		return HTTP.post(`${npsUrl}/v1/surveys/${npsId}/results`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data,
		});
	} catch (e) {
		SystemLogger.error(e);
		return false;
	}
});
