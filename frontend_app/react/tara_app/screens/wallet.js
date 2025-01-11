import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  FlatList,
  I18nManager,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import Button from "../components/Button";
import { TaraLogo, TaraWalletIcon } from "../components/CustomIcon";
import ParagraphText from "../components/ParagraphText";

const WalletScreen = ({ navigation }) => {
  const [activeTopup, setActiveTopup] = useState(false);
  const [activeSendOrTransfer, setActiveSendOrTransfer] = useState(false);
  const [walletTransactions, setWalletTransaction] = useState([
    {
      id: "1",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "2",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "3",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "4",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "5",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "6",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "7",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "8",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "9",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
    {
      id: "10",
      type: "ride",
      bookingId: "T-AR65ASD54",
      amount: "28.00",
    },
  ]);

  return (
    <View className="w-full h-full bg-white relative">
      <StatusBar style="dark" />
      <View className=" px-6 pt-10  border-b-[10px] border-slate-200">
        <View className="w-full flex flex-row gap-x-3 items-center justify-between py-2">
          <Pressable onPress={navigation.goBack()}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M19 11H9l3.29-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.41 0l-4.29 4.3A2 2 0 0 0 6 12a2 2 0 0 0 .59 1.4l4.29 4.3a1 1 0 1 0 1.41-1.42L9 13h10a1 1 0 0 0 0-2Z" />
            </Svg>
          </Pressable>
          <View className="p-1 bg-slate-200 rounded-lg">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="#374957"
            >
              <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" />
              <Path d="M12.717 5.063A4 4 0 0 0 8 9a1 1 0 0 0 2 0 2 2 0 0 1 2.371-1.967 2.024 2.024 0 0 1 1.6 1.595 2 2 0 0 1-1 2.125A3.954 3.954 0 0 0 11 14.257V15a1 1 0 0 0 2 0v-.743a1.982 1.982 0 0 1 .93-1.752 4 4 0 0 0-1.213-7.442Z" />
              <Rect width={2} height={2} x={11} y={17} rx={1} />
            </Svg>
          </View>
        </View>

        <View className="">
          <View
            className="w-full border border-slate-300 p-6 bg-white rounded-2xl 
        flex flex-row items-center justify-between"
          >
            <View className="">
              <TaraLogo size={50} />
            </View>

            <View>
              <Text className="text-2xl font-bold">₱128.00</Text>
              <Text className="text-base font-semibold">Available balance</Text>
            </View>

            <View></View>
          </View>

          <View className="w-full px-2">
            <View className="w-full py-4 flex flex-row gap-x-4 items-center justify-between">
              <TouchableOpacity
                onPress={() => setActiveTopup(true)}
                className="flex-1 bg-slate-100 p-3 rounded-xl flex gap-x-4 flex-row items-center justify-center"
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  fill="#3b82f6"
                >
                  <Path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10zm5-10a1 1 0 0 1-1 1h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V8a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
                </Svg>

                <Text className="text-base text-blue-500">Top Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveSendOrTransfer(true)}
                className="flex-1 bg-slate-100 p-3 rounded-xl flex gap-x-4 flex-row items-center justify-center"
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="#3b82f6"
                >
                  <Path d="M23.119.882a2.966 2.966 0 0 0-2.8-.8l-16 3.37a4.995 4.995 0 0 0-2.853 8.481l1.718 1.717a1 1 0 0 1 .293.708v3.168a2.965 2.965 0 0 0 .3 1.285l-.008.007.026.026A3 3 0 0 0 5.157 20.2l.026.026.007-.008a2.965 2.965 0 0 0 1.285.3h3.168a1 1 0 0 1 .707.292l1.717 1.717A4.963 4.963 0 0 0 15.587 24a5.049 5.049 0 0 0 1.605-.264 4.933 4.933 0 0 0 3.344-3.986l3.375-16.035a2.975 2.975 0 0 0-.792-2.833ZM4.6 12.238l-1.719-1.717a2.94 2.94 0 0 1-.722-3.074 2.978 2.978 0 0 1 2.5-2.026L20.5 2.086 5.475 17.113v-2.755a2.978 2.978 0 0 0-.875-2.12Zm13.971 7.17a3 3 0 0 1-5.089 1.712l-1.72-1.72a2.978 2.978 0 0 0-2.119-.878H6.888L21.915 3.5Z" />
                </Svg>

                <Text className="text-base text-blue-500">Send/Transfer</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full flex flex-row gap-x-4 items-center justify-between py-4">
              <Text className="text-base">Set as default payment method</Text>

              <ToggleButton />
            </View>
          </View>
        </View>
      </View>

      <View className="w-full p-6">
        <Text className="font-bold text-2xl text-neutral-700">
          Wallet transactions
        </Text>

        <FlatList
          data={walletTransactions}
          renderItem={({ item, index }) => (
            <TransactionItem
              key={item.id}
              bookingId={item.bookingId}
              amount={item.amount}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />

        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 5 }}
        >
          <View className="">
            {walletTransactions.map(({ id, bookingId, amount }) => {
              return (
                <TransactionItem
                  key={id}
                  bookingId={bookingId}
                  amount={amount}
                />
              );
            })}
          </View>
        </ScrollView> */}
      </View>

      {activeTopup && <TopupScreen close={() => setActiveTopup(false)} />}
      {activeSendOrTransfer && (
        <SendOrTransferScreen close={() => setActiveSendOrTransfer(false)} />
      )}
    </View>
  );
};

const TransactionItem = ({ bookingId, amount }) => {
  return (
    <View className="w-full border-b border-slate-200 flex flex-row gap-x-4 items-end justify-between py-4">
      <View className="">
        <Text className="text-sm">Ride</Text>
        <Text className="text-basee">Booking ID: {bookingId}</Text>
      </View>

      <Text className="font-bold text-base">₱{amount}</Text>
    </View>
  );
};

const ToggleButton = () => {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={() => setIsChecked(!isChecked)}
        className={`relative w-14 h-8 rounded-full ${
          isChecked ? "bg-blue-500" : "bg-gray-200"
        }`}
      >
        <View
          className={`absolute top-[3px] ${
            isChecked
              ? I18nManager.isRTL
                ? "right-[2px]"
                : "left-[25px]"
              : "left-[4px]"
          } w-6 h-6 bg-white rounded-full transition-transform`}
        />
      </Pressable>
    </View>
  );
};

const TopupScreen = ({ close }) => {
  const [amount, setAmount] = useState("");
  return (
    <View className="w-full h-screen bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className="h-full flex justify-between items-center px-6 py-10">
        <View>
          <View className="w-full flex flex-row gap-x-3 items-center justify-end py-2">
            <Pressable onPress={close}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#374957"
              >
                <Path d="M18 6a1 1 0 0 0-1.414 0L12 10.586 7.414 6A1 1 0 0 0 6 6a1 1 0 0 0 0 1.414L10.586 12 6 16.586A1 1 0 0 0 6 18a1 1 0 0 0 1.414 0L12 13.414 16.586 18A1 1 0 0 0 18 18a1 1 0 0 0 0-1.414L13.414 12 18 7.414A1 1 0 0 0 18 6Z" />
              </Svg>
            </Pressable>
          </View>

          <View className="py-4">
            <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
              <View className="p-2">
                <TaraWalletIcon color="#404040" size={30} />
              </View>

              <TextInput
                className="flex-1 text-lg text-blue-500"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
              />
            </View>

            <View className="w-full py-4">
              <Text className="text-2xl font-semibold">Payment Methods</Text>
              <Text className="text-base">
                Top up with this available payments
              </Text>
            </View>

            <View>
              <View className="flex flex-row gap-x-4 items-center border-b border-slate-200 py-4">
                <View>
                  <TaraLogo size={30} />
                </View>
                <View>
                  <Text className="text-xl text-blue-500">GCash</Text>
                </View>
              </View>
              <View className="flex flex-row gap-x-4 items-center border-b border-slate-200 py-4">
                <View>
                  <TaraLogo size={30} />
                </View>
                <View>
                  <Text className="text-xl text-blue-500">TaraPay</Text>
                </View>
              </View>
              <View className="flex flex-row gap-x-4 items-center border-b border-slate-200 py-4">
                <View>
                  <TaraLogo size={30} />
                </View>
                <View>
                  <Text className="text-xl text-blue-500">
                    Credit/debit card
                  </Text>
                </View>
              </View>
              <View className="flex flex-row gap-x-4 items-center border-b border-slate-200 py-4">
                <View>
                  <TaraLogo size={30} />
                </View>
                <View>
                  <Text className="text-xl text-blue-500">Coupon Redeemer</Text>
                </View>
              </View>
              <View className="flex flex-row gap-x-4 items-center border-b border-slate-200 py-4">
                <View>
                  <TaraLogo size={30} />
                </View>
                <View>
                  <Text className="text-xl text-blue-500">Maya</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-500"
        >
          By proceeding, you are confirming that all details are correct and
          understand our{" "}
          <Text className="text-blue-500 font-semibold">Refund Policy.</Text>
        </ParagraphText>
      </View>
    </View>
  );
};

const SendOrTransferScreen = ({ close }) => {
  const [amount, setAmount] = useState("");
  const [input, setInput] = useState("");

  return (
    <View className="w-full h-screen bg-white absolute inset-0 z-50">
      <StatusBar style="dark" />
      <View className=" border-b-[10px] border-slate-200">
        <View className="px-6 pt-10 ">
          <View className="w-full flex flex-row gap-x-3 items-center justify-end py-2">
            <Pressable onPress={close}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="#374957"
              >
                <Path d="M18 6a1 1 0 0 0-1.414 0L12 10.586 7.414 6A1 1 0 0 0 6 6a1 1 0 0 0 0 1.414L10.586 12 6 16.586A1 1 0 0 0 6 18a1 1 0 0 0 1.414 0L12 13.414 16.586 18A1 1 0 0 0 18 18a1 1 0 0 0 0-1.414L13.414 12 18 7.414A1 1 0 0 0 18 6Z" />
              </Svg>
            </Pressable>
          </View>

          <View className="">
            <Text className="text-2xl font-semibold py-4">Send/Transfer</Text>

            <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
              <View className="p-2">
                <TaraWalletIcon color="#404040" size={30} />
              </View>

              <TextInput
                className="flex-1 text-lg text-blue-500"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
              />
            </View>

            <Text className="text-sm py-4">
              Available Balance: (<Text className="font-bold">₱128.00</Text>)
            </Text>
          </View>
        </View>
      </View>

      <View className="w-full px-6 py-4">
        <Text className="text-lg font-semibold pb-4">Recepient: </Text>
        <View className="w-full border border-slate-400 p-2 rounded-2xl flex flex-row gap-x-2 items-center">
          <View className="p-2">
            <TaraLogo size={40} />
          </View>
          <TextInput
            className="w-full text-lg text-blue-500"
            type="text"
            value={input}
            onChangeText={setInput}
            placeholder=""
          />
        </View>
        <ParagraphText
          fontSize="sm"
          textColor="text-neutral-700"
          padding="py-1"
        >
          Make sure they linked their phone number or email address.
        </ParagraphText>{" "}
      </View>

      <View className="w-full flex gap-y-4 px-6 py-10">
        <ParagraphText
          align="center"
          fontSize="sm"
          textColor="text-neutral-500"
          padding="px-4"
        >
          By clicking “Send”, you confirm that all details are correct and that
          you understand our{" "}
          <Text className="text-blue-500 font-semibold">Refund Policy.</Text>
        </ParagraphText>
        <Button>Send</Button>
      </View>
    </View>
  );
};

export default WalletScreen;
