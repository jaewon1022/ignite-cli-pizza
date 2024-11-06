import { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { sendMessage, watchEvents, getReachability } from "react-native-watch-connectivity"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface AddSubScreenProps extends AppStackScreenProps<"AddSub"> {}

export const AddSubScreen: FC<AddSubScreenProps> = observer(function AddSubScreen() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    watchEvents.on("message", (message) => {
      const newCount = message.count as number

      if (newCount !== null && newCount !== undefined) {
        setCount(newCount)
      }
    })
  }, [])

  return (
    <Screen style={$root} preset="scroll">
      <Text text="addSub" />
      <Button
        title="+"
        onPress={async () => {
          const isReachable = await getReachability()

          if (isReachable) {
            setCount((count) => count + 1)
          }

          sendMessage(
            { count: count + 1 },
            (replyObj) => {
              console.log("reply from watchOS app: ", replyObj)
            },
            (error) => {
              console.log("error sending message to watchOS app: ", error)
            },
          )
        }}
      />

      <Text>{count}</Text>

      <Button title="-" onPress={() => setCount((count) => count - 1)} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
