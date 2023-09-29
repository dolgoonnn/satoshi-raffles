import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import Button from '@/components/Button'
// import MyInscriptions from '@/components/MyInscriptions'
import MyCreatedRaffles from '@/components/tabs/MyCreatedRaffles'
import axios from 'axios'
import Image from 'next/image'

export default function Profile() {
    //profile routing
    const Buttons = [
        {
            title: `My Inscriptions`,
            href: `/ins`,
        },
        {
            title: `My Created Raffles`,
            href: `/raf`,
        },
        {
            title: `My Tickets`,
            href: `/tic`,
        },
    ]
    //profile routing ends
    const router = useRouter()

    const [inscriptions, setInscriptions] = useState([])
    const [loading, setLoading] = useState(true)

    const slug = router.query.addr

    useEffect(() => {
        router.isReady && getInscriptions()
    }, [router.isReady])

    async function getInscriptions() {
        try {
            setLoading(true)
            let response = await axios({
                method: 'get',
                headers: {
                    'OK-ACCESS-KEY': process.env.OKLINK_API_KEY,
                },
                url: `https://www.oklink.com/api/v5/explorer/btc/address-balance-list?address=${slug}`,
            })

            if (response.data.msg == '') {
                let inscriptionDatas = response.data.data
                let result = []

                if (inscriptionDatas.length == 0) return
                for (let i = 0; i < inscriptionDatas.length; i++) {
                    for (
                        let j = 0;
                        j < parseInt(inscriptionDatas[i].totalPage);
                        j++
                    ) {
                        for (
                            let k = 0;
                            k < inscriptionDatas[i].balanceList.length;
                            k++
                        ) {
                            {
                                result.push({
                                    name: inscriptionDatas[i].balanceList[k]
                                        .token,
                                    availableBalance:
                                        inscriptionDatas[i].balanceList[k]
                                            .availableBalance,
                                    transferBalance:
                                        inscriptionDatas[i].balanceList[k]
                                            .transferBalance,
                                    balance:
                                        inscriptionDatas[i].balanceList[k]
                                            .balance,
                                })
                            }
                        }
                    }
                }
                setInscriptions(result)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className="max-w-[1216px] mx-auto">
            {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
            <div className=" flex flex-row gap-4 h-auto w-full justify-start items-center">
                <div className="flex flex-col w-[280px] h-auto gap-8">
                    <div className="flex flex-col w-full h-auto gap-[12px] p-[12px] border-lighterGray border rounded-xl">
                        <div className="flex flex-row items-center justify-center p-[12px] border border-lightGray rounded-lg">
                            <div className="w-[30%]">
                                <Image
                                    src="/profile.svg"
                                    alt="Profile"
                                    width={72}
                                    height={72}
                                    className="w-18 h-18 rounded-full mr-4"
                                />
                            </div>

                            <div className="w-[70%]">
                                <p>wallet address</p>
                            </div>
                        </div>
                        {/* <Button>My inscriptions</Button>
                        <Button>My Created Raffles</Button>
                        <Button>My Tickets</Button> */}
                        {Buttons.map((button, index) => (
                            <Button
                                key={index}
                                onClick={() => router.push(button.href)}
                            >
                                {button.title}
                            </Button>
                        ))}
                    </div>
                    <Button>Log out</Button>
                </div>

                {/* <MyInscriptions></MyInscriptions> */}
                <MyCreatedRaffles></MyCreatedRaffles>

                {/* <myProfile></myProfile> */}
                {/* <div className="flex flex-col md:flex-row gap-8">
          <div className="flex md:flex-row flex-col gap-9">
            {slug?.slice(0, 6) +
              "..." +
              slug?.slice(slug?.length - 4, slug?.length)}
          </div>
        </div>
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              BRC-20:
              <div className="grid grid-cols-5 gap-4 text-white">
                {inscriptions?.map((inscription, index) => (
                  <div key={index}>
                    <button className="flex flex-col border border-white p-6">
                      <div className="flex justify-between">
                        <div>{inscription.name}</div>
                      </div>
                      <div className="flex justify-between text-sm text-lightGray">
                        <div>Transferable: </div>
                        <div>{inscription.transferBalance}</div>
                      </div>
                      <div className="flex justify-between text-sm text-lightGray">
                        <div>Available: </div>
                        <div>{inscription.availableBalance}</div>
                      </div>
                      <div className="w-full h-0.5 bg-lightGray"></div>
                      <div className="flex justify-between text-sm text-lightGray">
                        <div>Balance: </div>
                        <div>{inscription.balance}</div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}
            </div>
        </div>
    )
}
