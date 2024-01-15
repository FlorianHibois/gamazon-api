import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./company";
import { Game } from "./game";

@Entity()
export class GameCompany extends BaseEntity
{
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(() => Company, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_company" })
	company!: Company | null;

	@ManyToOne(() => Game, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_game" })
	game!: Game | null;

	@Column({ type: "boolean", name: "is_developer" })
	isDeveloper!: boolean;

	@Column({ type: "boolean", name: "is_editor" })
	isEditor!: boolean;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
