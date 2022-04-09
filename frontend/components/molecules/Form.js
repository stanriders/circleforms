import getImage from '../../utils/getImage'
import Link from 'next/link'
import * as timeago from 'timeago.js';
import Tag from '../atoms/Tag'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import Button from '../atoms/Button';
import { useRouter } from 'next/router';
import Player from '../atoms/Player';
import InputRadio from '../atoms/InputRadio';
import { useEffect, useState } from 'react';
import bbobHTML from '@bbob/html'
import bbcodePreset from '../../libs/bbcode'
import { useTranslations } from 'next-intl';

export default function Form({
  id,
  author,
  author_id,
  is_active,
  icon,
  banner,
  title,
  description,
  publish_time,
  accessibility,
  limitations,
  answer_count,
  answers,
}) {
  const t = useTranslations()
  const router = useRouter()
  const [sort, setSort] = useState('rank')
  const bannerImg = getImage({ id, banner, type: 'banner' })
  const iconImg = getImage({ id, icon, type: 'icon' })

  return (
    <div>
      <div
        className="bg-cover h-60 w-full rounded-t-70"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(19, 19, 19, 0) -35.06%, #0F0F0F 100%),
            url('${bannerImg}')
          `
        }}
      />
      <div className="bg-black-dark2 p-16 relative rounded-b-70">
        <div className="absolute top-0 left-16 right-16 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="relative">
              <img
                className="h-20 w-20 rounded-full"
                src={iconImg}
                alt={`${title}'s thumbnail`} />
              <img
                className="h-10 w-10 rounded-full absolute bottom-0 right-0"
                src={author.avatar_url}
                alt={`${author.username}'s avatar`} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="text-white text-opacity-50 text-2xl">
                {answer_count ?? answers.length} { t('answersCount') }
              </p>
            </div>
          </div>

          <div className="p-4 bg-black-lightest rounded-14">
            <span className="text-4xl font-bold leading-5">{ t('status') }:</span>
            <Tag
              label={is_active ? t('active') : t('inactive')}
              theme={is_active ? 'success': 'stale'} />
          </div>
        </div>

        <Tabs className="mt-16 mb-4">
          <TabList>
            <Tab>{ t('tabs.info.title') }</Tab>
            <Tab>{ t('tabs.answers.title') }</Tab>
          </TabList>

          <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
            <TabPanel>
              <div
                className="bbcode"
                dangerouslySetInnerHTML={{
                  __html: bbobHTML(description, bbcodePreset())
                }} />
            </TabPanel>
            <TabPanel>
              <div className="flex flex-col">
                <InputRadio
                  name="sort"
                  value="rank"
                  label={t('sort.rank')}
                  onChange={setSort}
                />
                <InputRadio
                  name="sort"
                  value="date"
                  label={t('sort.date')}
                  onChange={setSort}
                />
              </div>

              <div className="text-center text-pink w-full border-4 border-pink rounded-14 py-2 mt-11 mb-10">
                <p dangerouslySetInnerHTML={{ __html: t.raw('mistakeNotice') }} />
              </div>

              <Player />
              <Player />
              <Player />
              <Player />
              <Player />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div className="flex justify-between">
          <Button theme="dark" onClick={router.back}>
            { t('back') }
          </Button>

          <Button theme="secondary">
            { t('answer') }
          </Button>
        </div>
      </div>
    </div>
  )
}