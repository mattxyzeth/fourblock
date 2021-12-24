const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const fourBlockContractFactory = await hre.ethers.getContractFactory('FourBlock');
  const fourBlockContract = await fourBlockContractFactory.deploy();
  await fourBlockContract.deployed();

  console.log("Contract deployed to:", fourBlockContract.address);
  console.log("Contract deployed by:", owner.address);

  let checkInCount;
  checkInCount = await fourBlockContract.getTotalCheckIns();

  let fourBlockTxn = await fourBlockContract.checkIn('45.2766731', '-75.9286733');
  await fourBlockTxn.wait();

  checkInCount = await fourBlockContract.getTotalCheckIns();

  fourBlockTxn = await fourBlockContract.connect(randomPerson).checkIn('43.6610569', '-79.311963');
  await fourBlockTxn.wait();

  checkInCount = await fourBlockContract.getTotalCheckIns();

  mem1checkIns = await fourBlockContract.getCheckIns()
  console.log(mem1checkIns)

  mem2checkIns = await fourBlockContract.connect(randomPerson).getCheckIns()
  console.log(mem2checkIns)
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
