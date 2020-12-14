import {
  HttpException,
  HttpService,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import omdbConfig from './omdb.config';

interface OmdbResponse {
  Response: string;
  Title?: string;
  Released?: string;
  Genre?: string;
  Directory?: string;
  [key: string]: unknown;
}

@Injectable()
export class OmdbService {
  constructor(
    @Inject(omdbConfig.KEY)
    private readonly config: ConfigType<typeof omdbConfig>,
    private readonly httpService: HttpService,
  ) {}

  async getMovieInfoByTitle(title: string) {
    try {
      const { data } = await this.httpService
        .get<OmdbResponse>(`http://www.omdbapi.com/`, {
          params: {
            apiKey: this.config.apiKey,
            t: title,
            type: 'movie',
          },
        })
        .toPromise();

      if (!this.isSuccess(data.Response)) {
        throw new NotFoundException();
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // TODO: Use logger like pino in future to log error
      throw new ServiceUnavailableException();
    }
  }

  private isSuccess(responseText: string) {
    return responseText === 'True';
  }
}
