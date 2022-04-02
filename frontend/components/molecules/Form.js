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
  const router = useRouter()
  const [sort, setSort] = useState('rank')
  const [bbcodeContent, setBbcodeContent] = useState('')
  const bannerImg = getImage({ id, banner, type: 'banner' })
  const iconImg = getImage({ id, icon, type: 'icon' })

  useEffect(() => {
    const processed = bbobHTML(`
      [b]text[/b]
      [i]text[/i]
      [u]text[/u]
      [strike]text[/strike]
      [color=#acff8f]text[/color]
      [size=64]text[/size]
      [spoiler]text[/spoiler]
      [spoilerbox]text[/spoilerbox]
      [quote="NAME"]
      text
      [/quote]
      [code]
      text
      [/code]
      [centre]text[/centre]
      [url=#]text[/url]
      [list=1]
      [*]item 1
      [*]item 2
      [*]item 3
      [/list]
      [list=a]
      [*]item 1
      [*]item 2
      [*]item 3
      [/list]
      [list=A]
      [*]item 1
      [*]item 2
      [*]item 3
      [/list]
      [list=i]
      [*]item 1
      [*]item 2
      [*]item 3
      [/list]
      [list=I]
      [*]item 1
      [*]item 2
      [*]item 3
      [/list]
      [img]https://a.ppy.sh/5914915?1639077555.jpeg[/img]
      [heading]text[/heading][notice]
      text
      [/notice]
      `,bbcodePreset()
    )

    setBbcodeContent(processed)
  }, [])

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
                {answer_count ?? answers.length} answers submitted
              </p>
            </div>
          </div>

          <div className="p-4 bg-black-lightest rounded-14">
            <span className="text-4xl font-bold leading-5">Status:</span>
            <Tag
              label={is_active ? 'Active' : 'Inactive'}
              theme={is_active ? 'success': 'stale'} />
          </div>
        </div>

        <Tabs className="mt-16 mb-4">
          <TabList>
            <Tab>Info</Tab>
            <Tab>Responses</Tab>
          </TabList>

          <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
            <TabPanel>
              <div
                className="bbcode"
                dangerouslySetInnerHTML={{ __html: bbcodeContent }} />
            </TabPanel>
            <TabPanel>
              <div className="flex flex-col">
                <InputRadio
                  name="sort"
                  value="rank"
                  label="Sort by rank"
                  onChange={setSort}
                />
                <InputRadio
                  name="sort"
                  value="date"
                  label="Sort chronologically"
                  onChange={setSort}
                />
              </div>

              <div className="text-center text-pink w-full border-4 border-pink rounded-14 py-2 mt-11 mb-10">
                <p>
                  Do you think that your or someone else's answer was not counted? Please text us in <a className="text-blue underline hover:no-underline" href="https://discord.com/channels/903049965952188437/903050905082011658">#reports</a> channel!
                </p>
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
            Back
          </Button>

          <Button theme="secondary">
            Register
          </Button>
        </div>
      </div>
    </div>
  )
}