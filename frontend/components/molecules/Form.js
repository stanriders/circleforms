import getImage from '../../utils/getImage'
import Link from 'next/link'
import * as timeago from 'timeago.js';
import Tag from '../atoms/Tag'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import Button from '../atoms/Button';
import { useRouter } from 'next/router';

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
  answer_count
}) {
  const router = useRouter()
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
                {answer_count} answers submitted
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
              Forum Post
              Discord
              Pick’em
              Spreadsheet
              Bracket
              Stream

              • This is an osu!standard, scorev2, 1v1 tournament
              • The rank range is #1 to #5,000
              • Joining the discord is required
              • The top 64 players from qualifiers will be placed into a double-elimination bracket

              Current prizepool: 1500€

              Check Forum Post for full information.
              Registration ends January 2 (23:59UTC).
              This registration is organized by nik.
            </TabPanel>
            <TabPanel>
              <span className="font-semibold text-3xl">
                Responses
              </span>
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