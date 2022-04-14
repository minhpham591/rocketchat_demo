import type { IStatistic } from '@rocket.chat/core-typings';

import { BaseRaw, IndexSpecification } from './BaseRaw';

export class StatisticsRaw extends BaseRaw<IStatistic> {
	protected indexes: IndexSpecification[] = [{ key: { createdAt: -1 } }];

	async findLast(): Promise<IStatistic> {
		const options = {
			sort: {
				createdAt: -1,
			},
			limit: 1,
		};
		const records = await this.find({}, options).toArray();
		return records?.[0];
	}
}
