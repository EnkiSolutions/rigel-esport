import { Generated } from "kysely";

// ToDo: Suscribed, Logo
type Championship = {
    name: string;               // Le nom du championnat
    teams: number;              // Le nombre d'équipes participantes
    players: number;            // Le nombre de joueurs par équipe
    subs: number | null;        // Le nombre de remplaçants max par équipe
    channelCategory: bigint;    // L'id de la catégorie discord du championnat
    channelInfos: bigint;       // L'id du channel discord des informations du championnat
    channelTeams: bigint;       // L'id du channel discord des participants aux championnat
    channelPlanning: bigint;    // L'id du channel discord du planning du championnat
    ownerRole: bigint;          // L'id du role d'organisateur du championnat
    managerRole: bigint;        // L'id du role de manager d'une équipe du championnat
    playerRole: bigint;         // L'id du role de joueur d'une équipe du championnat
}

export type ChampionshipsTable = Championship & { id: Generated<number>; }
export type Championnat = Championship & { id: number }

export interface PlayersTable {
    id: Generated<number>;
    name: string;               // Le nom du joueur
    discord: bigint | null;     // L'id de l'utilisateur discord
    tracker: string;            // Le tracker du joueur
    age: number;                // L'age indiqué par le joueur
}

export interface UsersTable {
    id: Generated<number>;
    key: string;                // Access token encryption key
    discordId: bigint;                      
    discordName: string;
    discordAvatar: string;
}

export type PlayerIds = { [k: (`main-${number}` | `sub-${number}`)]: bigint };

type Team = {
    name?: string | null;               // Le nom de l'équipe
    logo?: string | null;               // L'addresse du logo de l'équipe
    managerId: bigint;                  // L'id Discord du manager de l'équipe
    playersIds?: PlayerIds | null;      // Les ids Discord des joueurs de l'équipe
    victory: number;
    defeat: number;
}
export type Equipe = Team & { id: number };
export type TeamsTable = Team & { id: Generated<number> }

export type Matchs = { [k: `match-${number}`] : [number, number] }

export interface MatchsTable {
    id: Generated<number>;
    round: number;
    team1: number;
    team2: number;
}

export interface Database {
    users: UsersTable;
    championships: ChampionshipsTable;
    players: PlayersTable;
    [k: `cham-${string}-teams`]: TeamsTable;
    [k: `cham-${string}-matchs`]: MatchsTable;
}