import React from 'react';

import { usePermission } from '../../../contexts/AuthorizationContext';
import { useMethod } from '../../../contexts/ServerContext';
import { useToastMessageDispatch } from '../../../contexts/ToastMessagesContext';
import { useTranslation } from '../../../contexts/TranslationContext';
import NotAuthorizedPage from '../../notAuthorized/NotAuthorizedPage';
import { Mailer } from './Mailer';

export type sendMailObject = {
	fromEmail: { value: string; error?: string };
	subject: string;
	emailBody: string;
	dryRun: boolean;
	query: { value: string; error?: string };
};

type useSendMailType = () => ({ fromEmail, subject, emailBody, dryRun, query }: sendMailObject) => void;

const useSendMail: useSendMailType = () => {
	const meteorSendMail = useMethod('Mailer.sendMail');
	const t = useTranslation();
	const dispatchToastMessage = useToastMessageDispatch();

	return ({ fromEmail, subject, emailBody, dryRun, query }) => {
		if (query.error) {
			dispatchToastMessage({
				type: 'error',
				message: t('Query_is_not_valid_JSON'),
			});
			return;
		}
		if (fromEmail.error || fromEmail.value.length < 1) {
			dispatchToastMessage({
				type: 'error',
				message: t('error-invalid-from-address'),
			});
			return;
		}
		if (emailBody.indexOf('[unsubscribe]') === -1) {
			dispatchToastMessage({
				type: 'error',
				message: t('error-missing-unsubscribe-link'),
			});
			return;
		}

		meteorSendMail(fromEmail.value, subject, emailBody, dryRun, query.value);
		dispatchToastMessage({
			type: 'success',
			message: t('The_emails_are_being_sent'),
		});
	};
};

export default function MailerRoute() {
	const canAccessMailer = usePermission('access-mailer');
	const sendMail = useSendMail();

	if (!canAccessMailer) {
		return <NotAuthorizedPage />;
	}

	return <Mailer sendMail={sendMail} />;
}
