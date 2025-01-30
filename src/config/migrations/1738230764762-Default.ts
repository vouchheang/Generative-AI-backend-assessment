import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1738230764762 implements MigrationInterface {
    name = 'Default1738230764762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`certificate\` (\`id\` varchar(36) NOT NULL, \`courseName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`certificate\` ADD CONSTRAINT \`FK_52422eba9e5b9d779d3e173a25d\` FOREIGN KEY (\`userId\`) REFERENCES \`user_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`certificate\` DROP FOREIGN KEY \`FK_52422eba9e5b9d779d3e173a25d\``);
        await queryRunner.query(`DROP TABLE \`certificate\``);
    }

}
