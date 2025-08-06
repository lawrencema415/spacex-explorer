'use client';

import { HttpLink } from '@apollo/client';
import {
	ApolloNextAppProvider,
	ApolloClient,
	InMemoryCache,
} from '@apollo/client-integration-nextjs';

// Create a client for client-side rendering
function makeClient() {
	const httpLink = new HttpLink({
		uri: 'https://spacex-production.up.railway.app/',
	});

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: httpLink,
	});
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}
