const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const fourBlockContractFactory = await hre.ethers.getContractFactory('FourBlock');
  const fourBlockContract = await fourBlockContractFactory.deploy();
  await fourBlockContract.deployed();

  console.log("Contract deployed to:", fourBlockContract.address);
  console.log("Contract deployed by:", owner.address);

  let checkInCount;
  checkInCount = await fourBlockContract.getTotalCheckIns();

  let fourBlockTxn = await fourBlockContract.checkIn();
  await fourBlockTxn.wait();

  checkInCount = await fourBlockContract.getTotalCheckIns();

  fourBlockTxn = await fourBlockContract.connect(randomPerson).checkIn();
  await fourBlockTxn.wait();

  checkInCount = await fourBlockContract.getTotalCheckIns();

  let ownerCheckInCount = await fourBlockContract.checkInCountByAddress(owner.address)
  console.log(`${owner.address} has checked in ${ownerCheckInCount} times`)

  fourBlockTxn = await fourBlockContract.checkIn();
  await fourBlockTxn.wait();

  ownerCheckInCount = await fourBlockContract.checkInCountByAddress(owner.address)
  console.log(`${owner.address} has checked in ${ownerCheckInCount} times`)

  let randPerCheckInCount = await fourBlockContract.checkInCountByAddress(randomPerson.address)
  console.log(`${randomPerson.address} has checked in ${randPerCheckInCount} times`)
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
