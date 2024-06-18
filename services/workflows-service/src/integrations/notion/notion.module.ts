import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { z } from 'zod';

@Injectable()
export class NotionService {
  private readonly client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {
    this.client = new Client({
      auth: this.configService.get('NOTION_API_KEY'),
    });
  }

  public async getAllDatabaseRecordsValues<TSchema extends z.ZodType>({
    databaseId,
    schema,
  }: {
    databaseId: string;
    schema: TSchema;
  }) {
    const data = await this.extractDatabaseContent(databaseId);

    const transformedData = data.map(record => {
      return Object.fromEntries(
        Object.entries(record)
          .map(([fieldName, notionFieldPageObjectResponse]) => {
            return [fieldName, this.transformNotionFieldToValue(notionFieldPageObjectResponse)];
          })
          .filter(([, value]) => value === 0 || !!value),
      );
    });

    return schema.parse(transformedData) as z.infer<TSchema>;
  }

  private async extractDatabaseContent(databaseId: string) {
    let database: QueryDatabaseResponse | null = null;
    const records = [];

    do {
      database = await this.client.databases.query({
        database_id: databaseId,
        // @ts-ignore
        ...(database?.next_cursor && { start_cursor: database.next_cursor }),
      });
      records.push(...database.results);
    } while (database.next_cursor);

    const sanitizedRecords = records.filter(
      (record): record is PageObjectResponse => record.object === 'page' && 'properties' in record,
    );

    const data = sanitizedRecords.map(({ properties }) => properties);

    return data;
  }

  private transformNotionFieldToValue(
    notionField: PageObjectResponse['properties'][keyof PageObjectResponse['properties']],
  ) {
    if (notionField.type === 'rich_text') {
      return notionField.rich_text[0]?.plain_text;
    }

    if (notionField.type === 'multi_select') {
      return notionField.multi_select.map(({ name }) => name);
    }

    if (notionField.type === 'select') {
      return notionField.select?.name;
    }
    if (notionField.type === 'number') {
      return notionField.number;
    }

    if (notionField.type === 'date') {
      return notionField.date?.start;
    }

    if (notionField.type === 'url') {
      return notionField.url;
    }

    if (notionField.type === 'formula') {
      // @ts-expect-error - bad notion typing
      return notionField.formula[notionField.formula.type] as string | number | boolean;
    }

    if (notionField.type === 'relation') {
      return notionField.relation.map(({ id }) => id);
    }

    if (notionField.type === 'title') {
      return notionField.title[0]?.plain_text;
    }

    this.logger.warn(`Notion field type ${notionField.type} is not supported`);

    return;
  }
}
