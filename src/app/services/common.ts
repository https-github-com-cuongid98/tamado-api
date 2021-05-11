import Hobby from "$entities/Hobby";
import Job from "$entities/Job";
import { CommonStatus } from "$enums";
import { getConnection, getRepository, Repository } from "typeorm";
import { KeyCacheRedis } from "$enums";
import config from "$config";
import { clearRedisData } from "$helpers/redis";

export async function getListResource() {
  const hobbyRepo = getRepository(Hobby);
  const jobRepo = getRepository(Job);

  const [hobbies, jobs] = await Promise.all([
    getAllHobby(hobbyRepo),
    getAllJob(jobRepo),
  ]);
  return { hobbies, jobs };
}

export async function getAllHobby(hobbyRepo: Repository<Hobby>) {
  const hobbies = await hobbyRepo.find({
    where: {
      status: CommonStatus.ACTIVE,
    },
    cache: {
      id: KeyCacheRedis.RESOURCE,
      milliseconds: config.cacheExpire,
    },
  });
  return hobbies;
}

export async function getAllJob(jobRepo: Repository<Job>) {
  const jobs = await jobRepo.find({
    where: {
      status: CommonStatus.ACTIVE,
    },
    cache: {
      id: KeyCacheRedis.RESOURCE,
      milliseconds: config.cacheExpire,
    },
  });
  return jobs;
}

export async function clearCache() {
  await getConnection().queryResultCache.remove(Object.values(KeyCacheRedis));
  await clearRedisData(config.appName);
}
