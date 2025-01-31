import MealDetails from "./MealDetails";

interface PageProps {
  searchParams: {
    breakfast?: string;
  };
}

export default function Page({ searchParams }: any) {
  return <MealDetails breakfast={searchParams.breakfast} />;
}
