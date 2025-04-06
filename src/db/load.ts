import { DatabaseConnection } from "./DatabaseConnection.js";
import {
  answer,
  category,
  IAnswer,
  ICategory,
  ILevel,
  IQuestion,
  level,
  question,
} from "./schemas/index.js";
import dotenv from "dotenv";
import { EnvironmentLoader } from "../utils/environmentLoader/EnvironmentLoader.js";
import { weighting } from "./schemas/weighting.js";

dotenv.config({
  path: `.env.${EnvironmentLoader.load(["--mode:development"])}`,
});

const db = DatabaseConnection.getInstance();

interface IDataQuestion extends IQuestion {
  answers: IAnswer[];
}

interface IData extends ICategory {
  questions: IDataQuestion[];
  levels: ILevel[];
}

const weightingData: (typeof weighting.$inferInsert)[] = [
  {
    weighting_id: 1,
    weighting: 0,
  },
  {
    weighting_id: 2,
    weighting: 100,
  },
  {
    weighting_id: 3,
    weighting: 200,
  },
  {
    weighting_id: 4,
    weighting: 300,
  },
  {
    weighting_id: 5,
    weighting: 400,
  },
];

const data: IData[] = [
  {
    category_name: "Financial Health",
    category_description:
      "Evaluate your financial habits, planning, and stability. This category assesses your ability to plan for the future, manage your resources, and reach your financial objectives. Stress reduction and long-term professional and personal development are made possible by sound financial health.",
    category_image: "https://example.com/images/finhealth.jpg",
    questions: [
      {
        question_text: "How do you currently manage your financial resources?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I often struggle to cover my expenses and live paycheck-to-paycheck.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I can consistently cover my expenses and have some money for savings.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I actively save money and work toward achieving financial goals.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I have a clear plan for long-term financial stability and investments.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I am confident in my financial strategies and actively mentor others in financial management.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "What best describes your financial priorities right now?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text: "Covering basic needs and avoiding debt.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "Building an emergency fund and reducing unnecessary expenses.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "Saving for specific goals like buying a home or traveling.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Investing in long-term assets like retirement funds or real estate.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Achieving financial independence and helping others do the same.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How do you feel about your ability to plan for future financial needs?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I feel overwhelmed and unsure about planning for the future.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I am beginning to think about future expenses and exploring financial planning tools.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I have a budget and some short- and medium-term financial goals.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I regularly evaluate my financial plans to ensure I meet long-term goals.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I feel secure about the future and advise others on how to plan financially.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How prepared are you for unexpected financial emergencies?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I don’t have any savings and would struggle to handle an emergency.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I have a small emergency fund but it wouldn’t cover much.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I have enough savings to cover a minor emergency, like a car repair.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I have a solid emergency fund that could cover several months of expenses.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I am fully prepared for emergencies and have a plan to handle any financial setback.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How confident are you in your ability to make smart investment decisions?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I don’t know where to start and avoid investing altogether.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I’m learning about investing but still feel unsure about my decisions.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I make small investments and feel somewhat confident in my choices.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I regularly invest and feel confident in my ability to grow my wealth.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I’m an experienced investor and often guide others in making smart financial decisions.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
    ],
    levels: [
      {
        level_name: "Hm...",
        level_statement: "Yeah, that's sad :(",
        weighting_id: 1,
        category_id: null,
      },
      {
        level_name: "Ok!",
        level_statement: "You're not bad.",
        weighting_id: 2,
        category_id: null,
      },
      {
        level_name: "Not bad!",
        level_statement:
          "Good job for trying to improve your financial skills, take a look at how they could be further improved.",
        weighting_id: 3,
        category_id: null,
      },
      {
        level_name: "Good Job!",
        level_statement:
          "You are doing a good job managing your personal finances. Although, some of your habits could be improved.",
        weighting_id: 4,
        category_id: null,
      },
      {
        level_name: "You are great!",
        level_statement:
          "You are doing a great job managing your personal finances. Keep it up!",
        weighting_id: 5,
        category_id: null,
      },
    ],
  },
  {
    category_name: "Work You Enjoy",
    category_description:
      "Explore how fulfilled and confident you feel in your current role. This category looks at how well you align with your work, your ability to seek feedback, and how confident you are in your capacity to make a significant contribution. Enjoying your work is essential for sustained motivation and career satisfaction.",
    category_image: "https://example.com/images/wye.jpg",
    questions: [
      {
        question_text:
          "How do you feel about asking for help or feedback at work?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I feel uncomfortable asking for help and often try to figure things out alone.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I am learning to ask for help and view it as a part of growth.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I seek regular feedback and mentorship to improve my skills.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text: "I proactively share my knowledge and mentor others.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I actively create systems or initiatives to support team collaboration and learning.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "What best describes your confidence in your current role?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I often doubt my abilities and need reassurance from others.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I am starting to gain confidence in completing tasks but still rely on guidance.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I feel competent and contribute ideas to projects and discussions.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I am seen as an expert in my role and help guide others.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I consistently take on leadership roles and spearhead initiatives.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How aligned do you feel with the goals and mission of your work?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I’m unsure how my work contributes to the bigger picture.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I am beginning to see how my work aligns with company goals.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I actively seek to connect my tasks to company priorities.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I tailor my work to directly impact key organizational goals.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text: "I shape or influence company goals and strategies.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How often do you feel excited or motivated to start your workday?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text: "Rarely, I often dread going to work.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text: "Sometimes, but it depends on the tasks I have to do.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "Often, I usually find something to look forward to at work.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Frequently, I feel energized and motivated by my work.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Always, I’m passionate about my work and feel excited to contribute.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How well do your skills and strengths align with your current role?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "Not at all, I feel like I’m in the wrong role for my skills.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "Somewhat, but I often feel underutilized or mismatched.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "Moderately, I use some of my strengths but not all of them.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Well, I feel my skills and strengths are a good fit for my role.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Perfectly, I thrive in my role and feel it fully leverages my strengths.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
    ],
    levels: [
      {
        level_name: "Hm...",
        level_statement: "Yeah, that's sad :(",
        weighting_id: 1,
        category_id: null,
      },
      {
        level_name: "Ok!",
        level_statement: "You're not bad.",
        weighting_id: 2,
        category_id: null,
      },
      {
        level_name: "Not bad!",
        level_statement:
          "Good job for trying to improve your financial skills, take a look at how they could be further improved.",
        weighting_id: 3,
        category_id: null,
      },
      {
        level_name: "Good Job!",
        level_statement:
          "You are doing a good job managing your personal finances. Although, some of your habits could be improved.",
        weighting_id: 4,
        category_id: null,
      },
      {
        level_name: "You are great!",
        level_statement:
          "You are doing a great job managing your personal finances. Keep it up!",
        weighting_id: 5,
        category_id: null,
      },
    ],
  },
  {
    category_name: "Life Choice Fulfillment",
    category_description:
      "Reflect on how well your life choices align with your values and sense of purpose. This category assists you in assessing your fulfillment, balance, and clarity about your 'why'. Happiness and resilience increase when you live your life in accordance with your principles.",
    category_image: "https://example.com/images/lcf.jpg",
    questions: [
      {
        question_text:
          "How often do you reflect on what gives you fulfillment in life?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "Rarely, I haven’t thought much about what makes me happy.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "Sometimes, I am starting to explore what fulfillment means to me.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "Often, I focus on balancing personal and professional goals for fulfillment.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Frequently, I actively choose actions and paths that align with my values.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Constantly, I live and act in alignment with my core values and inspire others.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text: 'How would you describe your "why" or sense of purpose?',
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I don’t fully understand my 'why' or how to discover it.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I’m starting to identify what drives me, but it’s still unclear.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I have a solid understanding of my purpose and how it guides my actions.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text: "I align my daily choices with my purpose and values.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I’ve mastered living by my purpose and help others find theirs.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text: "How satisfied are you with the balance in your life?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "My life feels chaotic, and I don’t have much control over it.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I am beginning to organize my life but still struggle to maintain balance.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I feel I’m doing well in balancing my personal and professional life.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I intentionally prioritize and adjust my commitments to maintain balance.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I’ve mastered balance and coach others to do the same.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How often do you feel that your daily activities align with your long-term goals?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "Rarely, I feel like I’m just going through the motions.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "Sometimes, but I’m not sure if I’m on the right path.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "Often, I try to make choices that align with my goals.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Frequently, I actively prioritize activities that move me closer to my goals.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Always, I live intentionally and feel confident in my choices.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How satisfied are you with the amount of time you spend on activities you enjoy?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text: "Not at all, I rarely have time for things I enjoy.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "A little, but I wish I had more time for hobbies and passions.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "Somewhat, I try to balance work and personal interests.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Quite a bit, I make time for activities that bring me joy.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Completely, I prioritize my happiness and enjoy a fulfilling lifestyle.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
    ],
    levels: [
      {
        level_name: "Hm...",
        level_statement: "Yeah, that's sad :(",
        weighting_id: 1,
        category_id: null,
      },
      {
        level_name: "Ok!",
        level_statement: "You're not bad.",
        weighting_id: 2,
        category_id: null,
      },
      {
        level_name: "Not bad!",
        level_statement:
          "Good job for trying to improve your financial skills, take a look at how they could be further improved.",
        weighting_id: 3,
        category_id: null,
      },
      {
        level_name: "Good Job!",
        level_statement:
          "You are doing a good job managing your personal finances. Although, some of your habits could be improved.",
        weighting_id: 4,
        category_id: null,
      },
      {
        level_name: "You are great!",
        level_statement:
          "You are doing a great job managing your personal finances. Keep it up!",
        weighting_id: 5,
        category_id: null,
      },
    ],
  },
  {
    category_name: "Peer Community Fulfillment",
    category_description:
      "Assess your sense of belonging and contribution within your peer community. This category evaluates your capacity to encourage others, provide and receive feedback, and form deep connections. Collaboration, development, and a feeling of purpose are all enhanced by a strong peer network.",
    category_image: "https://example.com/images/pcf.jpg",
    questions: [
      {
        question_text:
          "How strong is your sense of belonging to a peer community?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text: "I don’t feel I belong to a supportive peer group.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I am starting to connect with others but don’t feel deeply involved.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I have a solid peer group where I contribute and feel valued.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I actively foster and grow meaningful peer relationships.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I lead or mentor within a peer community and create opportunities for others.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How comfortable are you giving and receiving feedback within your peer group?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I struggle to give or receive feedback and often avoid it.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I’m learning to provide constructive feedback and accept it without defensiveness.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I regularly give and receive feedback to strengthen peer relationships.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I proactively seek feedback to improve and offer thoughtful feedback to others.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I facilitate environments where feedback is regularly shared and valued.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How would you describe your role in helping others achieve their goals?",
        follow_up: false,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "I don’t feel equipped to help others or know how to start.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text:
              "I am beginning to understand how I can support others.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "I help others when asked and feel confident in doing so.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "I actively look for ways to support others’ growth and goals.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "I am seen as a leader and mentor who others turn to for guidance.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How often do you feel supported by your peers in achieving your goals?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "Rarely, I don’t feel connected to a supportive peer group.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text: "Sometimes, but I wish I had more support.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text: "Often, I have a few peers who encourage and help me.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Frequently, I feel supported and actively seek advice from my peers.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Always, I have a strong network that consistently helps me grow.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How comfortable are you in sharing your challenges or vulnerabilities with your peers?",
        follow_up: true,
        weighting_coefficient: 1,
        answers: [
          {
            answer_text:
              "Not at all, I avoid sharing personal challenges with others.",
            weighting_id: 1,
            question_id: null,
          },
          {
            answer_text: "A little, but only with people I trust deeply.",
            weighting_id: 2,
            question_id: null,
          },
          {
            answer_text:
              "Somewhat, I share when necessary but still feel hesitant.",
            weighting_id: 3,
            question_id: null,
          },
          {
            answer_text:
              "Quite a bit, I’m open about my challenges and seek support.",
            weighting_id: 4,
            question_id: null,
          },
          {
            answer_text:
              "Completely, I’m comfortable being vulnerable and often help others do the same.",
            weighting_id: 5,
            question_id: null,
          },
        ],
        category_id: null,
      },
    ],
    levels: [
      {
        level_name: "Hm...",
        level_statement: "Yeah, that's sad :(",
        weighting_id: 1,
        category_id: null,
      },
      {
        level_name: "Ok!",
        level_statement: "You're not bad.",
        weighting_id: 2,
        category_id: null,
      },
      {
        level_name: "Not bad!",
        level_statement:
          "Good job for trying to improve your financial skills, take a look at how they could be further improved.",
        weighting_id: 3,
        category_id: null,
      },
      {
        level_name: "Good Job!",
        level_statement:
          "You are doing a good job managing your personal finances. Although, some of your habits could be improved.",
        weighting_id: 4,
        category_id: null,
      },
      {
        level_name: "You are great!",
        level_statement:
          "You are doing a great job managing your personal finances. Keep it up!",
        weighting_id: 5,
        category_id: null,
      },
    ],
  },
];

async function truncateAll() {
  await db.execute('TRUNCATE "user", category RESTART IDENTITY CASCADE');
}

async function insertCategory(data: ICategory) {
  const res = await db
    .insert(category)
    .values(data)
    .returning({ category_id: category.category_id });

  return res[0].category_id;
}

async function insertQuestion(data: IQuestion) {
  const res = await db
    .insert(question)
    .values(data)
    .returning({ question_id: question.question_id });

  return res[0].question_id;
}

async function insertAnswer(data: IAnswer) {
  await db.insert(answer).values(data);
}

async function insertLevel(data: ILevel) {
  await db.insert(level).values(data);
}

async function insertWeighting(data: typeof weighting.$inferInsert) {
  await db.insert(weighting).values(data);
}

async function main() {
  console.log("Truncating tables...");
  await truncateAll();

  console.log("Inserting data...");

  for (const weighting of weightingData) {
    await insertWeighting(weighting);
  }

  for (const category of data) {
    const category_id = await insertCategory(category);

    for (const question of category.questions) {
      const question_id = await insertQuestion({ ...question, category_id });

      for (const answer of question.answers) {
        await insertAnswer({ ...answer, question_id });
      }
    }

    for (const level of category.levels) {
      await insertLevel({ ...level, category_id });
    }
  }

  console.log("The database has been loaded successfully.");
  process.exit();
}

main();
