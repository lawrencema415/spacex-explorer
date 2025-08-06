'use client';

import { gql, useQuery } from '@apollo/client';

const GET_LAUNCHES = gql`
	query GetLaunches {
		launchesPast(limit: 10) {
			mission_name
			launch_date_local
			id
			rocket {
				rocket_name
			}
		}
	}
`;

export default function Home() {
	const { loading, error, data } = useQuery(GET_LAUNCHES);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div style={{ padding: '2rem' }}>
			<h1>🚀 SpaceX Launches</h1>
			<ul>
				{data.launchesPast.map((launch: any) => (
					<li key={launch.id} style={{ marginBottom: '1rem' }}>
						<strong>{launch.mission_name}</strong> - {launch.rocket.rocket_name}
						<br />
						<small>{new Date(launch.launch_date_local).toLocaleString()}</small>
					</li>
				))}
			</ul>
		</div>
	);
}
