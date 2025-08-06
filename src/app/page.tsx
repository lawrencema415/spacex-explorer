'use client';

import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

interface Launch {
	id: string;
	mission_name: string;
	launch_date_local: string;
	details?: string;
	rocket: {
		rocket_name: string;
	};
}

interface Rocket {
	id: string;
	name: string;
	type: string;
	description: string;
	height?: {
		meters: number;
	};
	mass?: {
		kg: number;
	};
}

interface Ship {
	id: string;
	name: string;
	type: string;
	home_port?: string;
	year_built?: number;
}

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

const GET_ROCKETS = gql`
	query GetRockets {
		rockets {
			id
			name
			type
			description
			height {
				meters
			}
			mass {
				kg
			}
		}
	}
`;

const GET_SHIPS = gql`
	query GetShips {
		ships(limit: 10) {
			id
			name
			type
			home_port
			year_built
		}
	}
`;

const QUERIES = {
	GET_LAUNCHES: GET_LAUNCHES,
	GET_ROCKETS: GET_ROCKETS,
	GET_SHIPS: GET_SHIPS,
};

export default function Home() {
	const [selectedQuery, setSelectedQuery] = useState('GET_LAUNCHES');

	const { loading, error, data } = useQuery(QUERIES[selectedQuery]);

	const formatQuery = (queryString: string): string => {
		return queryString
			.replace(/^\s*query\s+\w+\s*\{\s*/m, '{\n  ')
			.replace(/\}\s*$/, '\n}')
			.replace(/\s{2,}/g, '  ')
			.replace(/\n\s*/g, '\n  ');
	};

	const getQueryString = () => {
		const queryDef = QUERIES[selectedQuery].loc.source.body;
		return formatQuery(queryDef);
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const renderData = () => {
		switch (selectedQuery) {
			case 'GET_LAUNCHES':
				return (
					<ul>
						{data.launchesPast.map((launch: Launch) => (
							<li key={launch.id} style={{ marginBottom: '1rem' }}>
								<strong>{launch.mission_name}</strong> -{' '}
								{launch.rocket.rocket_name}
								<br />
								<small>
									{new Date(launch.launch_date_local).toLocaleString()}
								</small>
							</li>
						))}
					</ul>
				);
			case 'GET_ROCKETS':
				return (
					<ul>
						{data.rockets.map((rocket: Rocket) => (
							<li key={rocket.id} style={{ marginBottom: '1rem' }}>
								<strong>{rocket.name}</strong> - {rocket.type}
								<br />
								<p>{rocket.description}</p>
								<small>
									{rocket.height?.meters && `Height: ${rocket.height.meters}m`}
									{rocket.mass?.kg && ` | Mass: ${rocket.mass.kg}kg`}
								</small>
							</li>
						))}
					</ul>
				);
			case 'GET_SHIPS':
				return (
					<ul>
						{data.ships.map((ship: Ship) => (
							<li key={ship.id} style={{ marginBottom: '1rem' }}>
								<strong>{ship.name}</strong> - {ship.type}
								<br />
								<small>
									{ship.home_port && `Home Port: ${ship.home_port}`}
									{ship.year_built && ` | Built: ${ship.year_built}`}
								</small>
							</li>
						))}
					</ul>
				);
			default:
				return <p>No data available</p>;
		}
	};

	return (
		<div style={{ padding: '2rem' }}>
			<h1>🚀 SpaceX Explorer</h1>

			{/* Query selector */}
			<div style={{ marginBottom: '2rem' }}>
				<h2>Select a Query</h2>
				<select
					value={selectedQuery}
					onChange={(e) => setSelectedQuery(e.target.value)}
					style={{
						padding: '0.5rem',
						fontSize: '1rem',
						width: '100%',
						maxWidth: '400px',
						marginBottom: '1rem',
					}}
				>
					<option value='GET_LAUNCHES'>Past Launches</option>
					<option value='GET_ROCKETS'>Rockets</option>
					<option value='GET_SHIPS'>Ships</option>
				</select>
			</div>

			<div style={{ marginBottom: '2rem' }}>
				<h2>Query</h2>
				<pre
					style={{
						background: '#f4f4f4',
						padding: '1rem',
						borderRadius: '4px',
						overflow: 'auto',
						color: '#333',
					}}
				>
					<code>{getQueryString()}</code>
				</pre>
			</div>

			<div>
				<h2>Results</h2>
				{renderData()}
			</div>
		</div>
	);
}
